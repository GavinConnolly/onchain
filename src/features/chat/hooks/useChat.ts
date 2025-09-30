import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { chatConfig } from '../../../config/chat.config';

let messageIdCounter = 0;
const generateMessageId = () => {
  messageIdCounter += 1;
  return `msg_${Date.now()}_${messageIdCounter}`;
};

// TODO : Offline first persistence, global message handling etc. While the chat is in demo mode, it can only receive messages a moment after a message is sent (as an echo).

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  type: 'sent' | 'received' | 'system';
}

type ChatConnectionState =
  | { status: 'disconnected' }
  | { status: 'connecting' }
  | { status: 'connected' };

export interface UseChatReturn {
  messages: Message[];
  connectionState: ChatConnectionState;
  inputText: string;
  setInputText: (text: string) => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  sendMessage: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [connectionState, setConnectionState] = useState<ChatConnectionState>({
    status: 'disconnected',
  });
  const wsRef = useRef<WebSocket | null>(null);
  const wasConnectedRef = useRef(false);
  const isMountedRef = useRef(true);
  const sendingRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const addMessage = useCallback(
    (text: string, type: 'sent' | 'received' | 'system') => {
      if (!isMountedRef.current) return;

      const newMessage: Message = {
        id: generateMessageId(),
        text,
        timestamp: new Date(),
        type,
      };
      setMessages(prev => [...prev, newMessage]);
    },
    [],
  );

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionState({ status: 'connecting' });
    console.log('Connecting to WebSocket...');

    try {
      wsRef.current = new WebSocket(chatConfig.serverUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        if (!isMountedRef.current) return;
        wasConnectedRef.current = true;
        setConnectionState({ status: 'connected' });
        addMessage('Connected to chat server', 'system');
      };

      wsRef.current.onmessage = event => {
        if (!isMountedRef.current) return;
        console.log('Received message:', event.data);
        addMessage(event.data, 'received');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnectionState({ status: 'disconnected' });
        if (wasConnectedRef.current) {
          addMessage('Disconnected from chat server', 'system');
        }
        wasConnectedRef.current = false;
      };

      wsRef.current.onerror = error => {
        if (!isMountedRef.current) return;
        console.error('WebSocket error:', error);
        setConnectionState({ status: 'disconnected' });
        wasConnectedRef.current = false;
        addMessage('Failed to connect to chat server', 'system');
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionState({ status: 'disconnected' });
      wasConnectedRef.current = false;
      addMessage('Failed to create WebSocket connection', 'system');
    }
  }, [addMessage]);

  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionState({ status: 'disconnected' });
  }, []);

  const sendMessage = useCallback(() => {
    if (sendingRef.current) {
      return;
    }

    if (
      !inputText.trim() ||
      connectionState.status !== 'connected' ||
      !wsRef.current
    )
      return;

    const messageText = inputText.trim();
    sendingRef.current = true;

    try {
      wsRef.current.send(messageText);
      addMessage(messageText, 'sent');
      setInputText('');
      console.log('Sent message:', messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage('Failed to send message', 'system');
      Alert.alert('Send Error', 'Failed to send message. Please try again.');
    } finally {
      sendingRef.current = false;
    }
  }, [inputText, connectionState.status, addMessage]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    messages,
    connectionState,
    inputText,
    setInputText,
    connectWebSocket,
    disconnectWebSocket,
    sendMessage,
  };
}
