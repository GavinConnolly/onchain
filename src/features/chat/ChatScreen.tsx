import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native';

import clsx from 'clsx';
import { useChat, Message } from './hooks/useChat';
import { KeyboardAvoidView, Button, BackgroundOrb } from '../../components';
import { shadows } from '../../styles';

export default function ChatScreen() {
  const { messages, connectionState, inputText, setInputText, sendMessage } =
    useChat();

  const isConnected = connectionState.status === 'connected';
  const isConnecting = connectionState.status === 'connecting';

  const flatListRef = useRef<FlatList>(null);

  const chatData = useMemo(() => {
    const data: (Message | 'connecting')[] = [...messages];
    if (isConnecting) {
      data.push('connecting');
    }
    return data;
  }, [messages, isConnecting]);

  useEffect(() => {
    // Auto-scroll
    if (chatData.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatData]);

  const renderMessage: ListRenderItem<Message | 'connecting'> = useCallback(
    ({ item }) => {
      if (item === 'connecting') {
        return (
          <View className="mb-3 mt-3 items-center">
            <View className="flex-colum items-center">
              <ActivityIndicator
                size="small"
                className="text-gray-500 dark:text-gray-400"
              />
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Connecting to chat server...
              </Text>
            </View>
          </View>
        );
      }

      const message = item as Message;

      if (message.type === 'system') {
        return (
          <View className="mb-3 items-center">
            <View className="bg-kraken-med dark:bg-kraken-dark-med px-6 py-2 rounded-full">
              <Text className="text-sm text-gray-800 dark:text-gray-300 text-center">
                {message.text}
              </Text>
            </View>
          </View>
        );
      }

      return (
        <View
          className={clsx(
            'mb-3',
            message.type === 'sent' ? 'items-end' : 'items-start',
          )}
        >
          <View
            className={clsx(
              'max-w-[80%] px-3 py-2 rounded-2xl',
              message.type === 'sent'
                ? 'bg-white dark:bg-kraken-med-dark rounded-br-sm'
                : 'bg-kraken-purple rounded-bl-sm',
            )}
            // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
            style={message.type === 'sent' ? undefined : shadows.card}
          >
            <Text
              className={clsx(
                'text-base leading-5',
                message.type === 'sent'
                  ? 'text-gray-800 dark:text-gray-200'
                  : 'text-white',
              )}
            >
              {message.text}
            </Text>
            <Text
              className={clsx(
                'text-xs mt-1',
                message.type === 'sent'
                  ? 'text-gray-400 dark:text-gray-500'
                  : '',
              )}
              // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
              /* eslint-disable react-native/no-inline-styles */
              style={
                message.type === 'sent'
                  ? undefined
                  : { color: 'rgba(255, 255, 255, 0.7)' }
              }
              /* eslint-enable react-native/no-inline-styles */
            >
              {message.timestamp.toLocaleTimeString()}
            </Text>
          </View>
        </View>
      );
    },
    [],
  );

  const keyExtractor = useCallback((item: Message | 'connecting') => {
    return item === 'connecting' ? 'connecting' : item.id;
  }, []);

  return (
    <KeyboardAvoidView className="flex-1 bg-kraken-light dark:bg-kraken-dark">
      <BackgroundOrb />
      <FlatList
        ref={flatListRef}
        data={chatData}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        className="flex-1 px-4"
        contentContainerClassName="py-4"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={15}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
        getItemLayout={undefined}
        inverted={false}
      />

      <View className="flex-row p-4 bg-kraken-light dark:bg-kraken-dark border-t border-white dark:border-kraken-med-dark items-end">
        <TextInput
          className="flex-1 border border-white dark:dark:border-kraken-med-dark  rounded-3xl px-4 py-2.5 max-h-[100px] text-base text-gray-800 dark:text-gray-200 bg-white dark:bg-kraken-dark-med"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          editable={isConnected}
        />
        <Button
          title={!isConnected ? 'Offline' : 'Send'}
          variant="round"
          onPress={sendMessage}
          disabled={!inputText.trim() || !isConnected}
          className="ml-2"
        />
      </View>
    </KeyboardAvoidView>
  );
}
