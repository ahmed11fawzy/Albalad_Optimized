import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ChatHeader from './ChatHeader';
import ChatButton from './ChatButton';
import QuickActions from './display/QuickActions';
import MessageBubble from './MessageBubble';
import TypingIndicator from './buttons/TypingIndicator';
import QuickReplies from './buttons/QuickReplies';
import ChatInput from './ChatInput';
import io from 'socket.io-client';
import './CustomerServiceChat.css';
import { useSelector } from 'react-redux';
import { useGetConversationsQuery, useGetMessagesQuery } from '../../redux/Slices/chat';

const CustomerServiceChat = ({ product, Store ,Open }) => {
  // UI State

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [msgNotificationCount, setMsgNotificationCount] = useState(0);
  
  // Data State
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  // Redux state
  const { token, userId } = useSelector((state) => state.globalData);
  
  // RTK Query hooks with proper skip conditions
  const { data: conversations, isLoading: conversationsLoading } = useGetConversationsQuery(
    undefined,
    { skip: !token || !userId }
  );

  // Find conversation from RTK Query data
  const currentConversation = useMemo(() => {
    if (!conversations?.data || !userId || !Store?.id) return null;
    return conversations.data.find(conv => 
      conv.customer.id == userId && conv.store.id == Store.id
    );
  }, [conversations?.data, userId, Store?.id]);
  const { data: conversationMessages, isLoading: messagesLoading } = useGetMessagesQuery( conversationId);

  // Memoized values
  const baseUrl = useMemo(() => import.meta.env.VITE_BASE_URL, []);
  
  const authHeaders = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  const quickReplies = useMemo(() => [
    'I need help with my order',
    'Billing question',
    'Technical support',
    'Return/Exchange',
  ], []);

  

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Format time function
  const formatTime = useCallback((date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Handle conversation ID updates
  useEffect(() => {
    if (currentConversation?.id !== conversationId) {
      setConversationId(currentConversation?.id || null);
    }
  }, [currentConversation?.id, conversationId]);

  // Update messages from RTK Query
  useEffect(() => {
    if (conversationMessages?.data) {
      setMessages(conversationMessages.data);
      setHasSentMessage(conversationMessages.data.length > 0);
      
    }
  }, [conversationMessages?.data]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Handle notification count
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setMsgNotificationCount(0);
    } else if (messages.length > 0 && !isOpen) {
      // Count unread agent messages when chat is closed
      const unreadCount = messages.filter(msg => msg.isAgent && !msg.read).length;
      setMsgNotificationCount(unreadCount);
    }
  }, [isOpen, isMinimized, messages]);

 

  // Send message function
  const sendMessage = useCallback(async (storeId) => {
    if (!newMessage.trim() || !token) return;


    try {
      setIsTyping(true);
      setError(null);

      const response = await fetch(`${baseUrl}chats/send`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ 
          store_id: storeId, 
          content: { type: 'text', text: newMessage }, 
          message_type: 'text' 
        }),
        
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update conversation ID if needed
      if (data?.data?.conversation?.id && data.data.conversation.id !== conversationId) {
        setConversationId(data.data.conversation.id);
      }

      setNewMessage('');
      setHasSentMessage(true);
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setIsTyping(false);
    }
  }, [newMessage, token, baseUrl, authHeaders, conversationId]);

  // Event handlers
  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() && Store?.id) {
      sendMessage(Store.id);
    }
  }, [newMessage, Store?.id, sendMessage]);

  const handleQuickReply = useCallback((reply) => {
    setNewMessage(reply);
    setHasSentMessage(true);
  }, []);

  const handleToggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const handleOpen = useCallback(() => {
    if(Open){
      setIsOpen(Open);
    }

    setIsOpen(true);
  }, []);


  // Loading state
  if (conversationsLoading || messagesLoading) {
    return (
      <div className={`${product ? 'chat-container--product' : 'chat-container'}`}>
        <div className="chat-loading">Loading chat...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${product ? 'chat-container--product' : 'chat-container'}`}>
        <div className="chat-error">
          {error}
          <button onClick={() => setError(null)}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${product ? 'chat-container--product' : 'chat-container'}`}>
      {/* Chat Button */}
      {!isOpen && (
        <ChatButton
          product={product}
          onClick={handleOpen}
          notificationCount={msgNotificationCount}
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isMinimized ? 'chat-window--minimized' : 'chat-window--full'}`}>
          <ChatHeader
            store={Store?.name_ar}
            isMinimized={isMinimized}
            onToggleMinimize={handleToggleMinimize}
            onClose={handleClose}
          />

          {!isMinimized && (
            <>
              <QuickActions />

              {/* Messages */}
              <div className="messages-container">
                {isLoadingMessages ? (
                  <div className="loading-messages">Loading messages...</div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <MessageBubble
                        key={message.id || index}
                        message={message}
                        formatTime={formatTime}
                      />
                    ))}
                  </>
                )}

                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {!hasSentMessage && (
                <QuickReplies
                  replies={quickReplies}
                  onReplySelect={handleQuickReply}
                />
              )}

              <ChatInput
                message={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
                disabled={isTyping}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(CustomerServiceChat);