import React, { useState, useEffect, useRef } from 'react'
import { useGetConversationsQuery, useGetMessagesQuery, useSendMessageMutation } from '../redux/Slices/chat'
import { useGetFollowedStoresQuery, useUnfollowStoreMutation } from '../redux/Slices/followersApi'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import { FaChevronRight, FaChevronLeft, FaStore, FaHeart, FaComment, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUsers, FaPaperPlane } from 'react-icons/fa'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import styles from './Chats.module.css'
import { useGetCurrentUserQuery } from '../redux/Slices/authApi'

const Chats = () => {
    const {data:user , isLoading:userLoading} = useGetCurrentUserQuery()
    console.log("🚀 ~ Chats ~ user:", user)
    const { data: conversations, isLoading } = useGetConversationsQuery()
    const { data: followedStoresData, isLoading: isLoadingFollowed } = useGetFollowedStoresQuery()
    console.log("🚀 ~ Chats ~ followedStoresData:", followedStoresData)
    const [unfollowStore] = useUnfollowStoreMutation()
    const [sendMessage] = useSendMessageMutation()
    const { token, userId } = useSelector((state) => state.globalData)
    
  

    const [selectedStore, setSelectedStore] = useState(null)
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [activeTab, setActiveTab] = useState('conversations')
    const [newMessage, setNewMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    
    const messagesEndRef = useRef(null)
    
    // Extract followed stores from API response
    const followedStores = user?.followers || []
    
    // Get messages for selected conversation
    const { data: messagesData, isLoading: messagesLoading } = useGetMessagesQuery(
        selectedConversation?.id,
        { skip: !selectedConversation?.id }
    )
    
    const messages = messagesData?.data || []

    const handleStoreClick = (store) => {
        setSelectedStore(store)
        // Find existing conversation with this store
        const existingConversation = conversations?.data?.find(conv => conv.store.id === store.id)
        setSelectedConversation(existingConversation || null)
    }

    const handleConversationClick = (conversation) => {
        setSelectedStore(conversation.store)
        setSelectedConversation(conversation)
    }

    const handleUnfollow = async (storeId, event) => {
        event.stopPropagation()
        try {
            await unfollowStore(storeId).unwrap()
        } catch (error) {
            console.error('Error unfollowing store:', error)
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedStore || isTyping) return
        
        setIsTyping(true)
        try {
            const messageData = {
                store_id: selectedStore.id,
                content: {
                    type: 'text',
                    text: newMessage
                },
                message_type: 'text'
            }
            
            if (selectedConversation?.id) {
                messageData.conversation_id = selectedConversation.id
            }
            
            await sendMessage(messageData).unwrap()
            setNewMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatMessageTime = (timestamp) => {
        const messageTime = new Date(timestamp)
        return messageTime.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    }

    const formatLastMessageTime = (timestamp) => {
        const now = new Date()
        const messageTime = new Date(timestamp)
        const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60))
        
        if (diffInHours < 1) return 'الآن'
        if (diffInHours < 24) return `${diffInHours}س`
        
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays}ي`
        
        return messageTime.toLocaleDateString('ar-SA')
    }

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    if (isLoading) {
        return (
            <div className={styles.chatsLoading}>
                <div className={styles.loaderCircle}></div>
                <p>جاري تحميل المحادثات...</p>
            </div>
        )
    }

    return (
        <div className={styles.chatsPage} style={{marginTop:"100px"}} >
            <div className={styles.chatsContainer}>
                {/* Header */}
                {/* <div className={styles.chatsHeader}>
                    <h1>المحادثات</h1>
                    <div className={styles.chatsTabs}>
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'conversations' ? styles.active : ''}`}
                            onClick={() => setActiveTab('conversations')}
                        >
                            <FaComment /> المحادثات
                        </button>
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'stores' ? styles.active : ''}`}
                            onClick={() => setActiveTab('stores')}
                        >
                            <FaHeart /> المتاجر المتبعة
                        </button>
                    </div>
                </div> */}

                

                {/* Main Content */}
                <div className={styles.chatsContent}>
                    {/* Conversations Sidebar */}
                    <div className={styles.conversationsSidebar}>

                        {/* Followed Stores Swiper */}
                        <div className={styles.followedStoresSection}>
      <h2>المتاجر المتبعة</h2>
      {isLoadingFollowed ? (
        <div className={styles.storesLoading}>
          <div className={styles.loaderCircle}></div>
        </div>
      ) : followedStores.length > 0 ? (
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={15}
          slidesPerView={3.5} // Default for smallest screens
          freeMode={true} // Enables free mode for smooth scrolling
          navigation={{
            nextEl: '.stores-swiper-next',
            prevEl: '.stores-swiper-prev',
          }}
          breakpoints={{
            1400: { slidesPerView: 8.5 }, // Large desktops
            1200: { slidesPerView: 7.5 }, // Desktops
            900: { slidesPerView: 5.5 }, // Tablets
            600: { slidesPerView: 4.5 }, // Large mobile
            0: { slidesPerView: 3.5 }, // Small mobile
          }}
          dir="rtl" // Right-to-left for Arabic
          className={styles.followedStoresSwiper}
        >
          {followedStores.map((store) => (
            <SwiperSlide key={store.id}>
              <div className={styles.storeCard} onClick={() => handleStoreClick(store)}>
                <div className={styles.storeAvatar}>
                  {store.logo ? (
                    <img src={store.logo} alt={store.name_ar} />
                  ) : (
                    <div className={styles.storePlaceholder}>
                      <FaStore />
                    </div>
                  )}
                  <div className={`${styles.storeStatus} ${styles.online}`}></div>
                </div>
                <div className={styles.storeName}>{store.name_ar}</div>
                {/* Uncomment if unfollow functionality is needed */}
                {/* <button
                  className={styles.unfollowBtn}
                  onClick={(e) => handleUnfollow(store.id, e)}
                >
                  إلغاء المتابعة
                </button> */}
              </div>
            </SwiperSlide>
          ))}
          {/* Navigation buttons */}
          <div className="stores-swiper-prev"></div>
          <div className="stores-swiper-next"></div>
        </Swiper>
      ) : (
        <div className={styles.noStores}>
          <FaHeart className={styles.noStoresIcon} />
          <p>لا توجد متاجر متبعة</p>
        </div>
      )}
    </div>

                        {activeTab === 'conversations' ? (
                            <div className={styles.conversationsList}>
                                {conversations?.data?.length > 0 ? (
                                    conversations.data.map((conversation) => (
                                        <div 
                                            key={conversation.id}
                                            className={`${styles.conversationItem} ${selectedConversation?.id === conversation.id ? styles.active : ''}`}
                                            onClick={() => handleConversationClick(conversation)}
                                        >
                                            <div className={styles.conversationAvatar}>
                                                {conversation.store.logo ? (
                                                    <img src={conversation.store.logo} alt={conversation.store.name_ar} />
                                                ) : (
                                                    <div className={styles.avatarPlaceholder}>
                                                        <FaStore />
                                                    </div>
                                                )}
                                                <div className={styles.onlineIndicator}></div>
                                            </div>
                                            <div className={styles.conversationInfo}>
                                                <div className={styles.conversationHeader}>
                                                    <h3>{conversation.store.name_ar}</h3>
                                                    <span className={styles.time}>{formatLastMessageTime(conversation.updated_at)}</span>
                                                </div>
                                                <div className={styles.conversationPreview}>
                                                    <p>{conversation.last_message?.content?.text || 'ابدأ محادثة جديدة'}</p>
                                                    {conversation.unread_count > 0 && (
                                                        <span className={styles.unreadBadge}>{conversation.unread_count}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noConversations}>
                                        <FaComment className={styles.noConversationsIcon} />
                                        <p>لا توجد محادثات</p>
                                        <p className={styles.noConversationsSub}>اختر متجر من المتاجر المتبعة لبدء محادثة</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles.followedStoresList}>
                                {followedStores.map((store) => (
                                    <div 
                                        key={store.id}
                                        className={`${styles.storeItem} ${selectedStore?.id === store.id ? styles.active : ''}`}
                                        onClick={() => handleStoreClick(store)}
                                    >
                                        <div className={styles.storeAvatar}>
                                            {store.logo ? (
                                                <img src={store.logo} alt={store.name_ar} />
                                            ) : (
                                                <div className={styles.avatarPlaceholder}>
                                                    <FaStore />
                                                </div>
                                            )}
                                            <div className={styles.onlineIndicator}></div>
                                        </div>
                                        <div className={styles.storeInfo}>
                                            <h3>{store.name_ar}</h3>
                                            <div className={styles.storeMeta}>
                                                <div className={styles.rating}>
                                                    <FaStar className={styles.starIcon} />
                                                    <span>{store.average_rating || '4.5'}</span>
                                                </div>
                                                <div className={styles.followers}>
                                                    <FaUsers className={styles.usersIcon} />
                                                    <span>{store.count_followers || '0'} متابع</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            className={styles.unfollowBtn}
                                            onClick={(e) => handleUnfollow(store.id, e)}
                                        >
                                            إلغاء المتابعة
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    

                    {/* Chat Area */}
                    <div className={styles.chatArea}>
                        {selectedStore ? (
                            <>
                                {/* Chat Header */}
                                <div className={styles.chatHeader}>
                                    <div className={styles.chatStoreInfo}>
                                        <div className={styles.chatStoreAvatar}>
                                            {selectedStore.logo ? (
                                                <img src={selectedStore.logo} alt={selectedStore.name_ar} />
                                            ) : (
                                                <div className={styles.avatarPlaceholder}>
                                                    <FaStore />
                                                </div>
                                            )}
                                            <div className={styles.onlineIndicator}></div>
                        </div>
                        <div className={styles.chatStoreDetails}>
                            <h3>{selectedStore.name_ar}</h3>
                            <p>متصل الآن</p>
                        </div>
                    </div>
                </div>

                                {/* Messages Area */}
                                <div className={styles.messagesArea}>
                                    {messagesLoading ? (
                                        <div className={styles.messagesLoading}>
                                            <div className={styles.loaderCircle}></div>
                                            <p>جاري تحميل الرسائل...</p>
                                        </div>
                                    ) : messages.length > 0 ? (
                                        <div className={styles.messagesList}>
                                            {messages.map((message) => (
                                                <div 
                                                    key={message.id}
                                                    className={`${styles.message} ${message.is_sender ? styles.sent : styles.received}`}
                                                >
                                                    <div className={styles.messageContent}>
                                                        <p>{message.content.text}</p>
                                                        <span className={styles.messageTime}>
                                                            {formatMessageTime(message.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            {isTyping && (
                                                <div className={`${styles.message} ${styles.received}`}>
                                                    <div className={`${styles.messageContent} ${styles.typing}`}>
                                                        <div className={styles.typingIndicator}>
                                                            <span></span>
                                                            <span></span>
                                                            <span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    ) : (
                                        <div className={styles.noMessages}>
                                            <FaComment className={styles.noMessagesIcon} />
                                            <p>لا توجد رسائل</p>
                                            <p>ابدأ محادثة جديدة مع {selectedStore.name_ar}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className={styles.messageInputArea}>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="اكتب رسالتك هنا..."
                                            disabled={isTyping}
                                            className={styles.messageInput}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || isTyping}
                                            className={styles.sendButton}
                                        >
                                            <FaPaperPlane />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.noSelection}>
                                <FaComment className={styles.noSelectionIcon} />
                                <h3>اختر متجر لبدء المحادثة</h3>
                                <p>اختر متجر من القائمة الجانبية أو من المتاجر المتبعة لبدء محادثة جديدة</p>
                            </div>
                        )}
                    </div>
                    {/* Store Details Panel */}
                    {selectedStore && (
                        <div className={styles.storeDetailsPanel}>
                            <div className={styles.storeHeader}>
                                <div className={styles.storeAvatarLarge}>
                                    {selectedStore.logo ? (
                                        <img src={selectedStore.logo} alt={selectedStore.name_ar} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <FaStore />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.storeInfoDetailed}>
                                    <h2>{selectedStore.name_ar}</h2>
                                    <div className={styles.storeStats}>
                                        <div className={styles.stat}>
                                            <FaStar className={styles.icon} />
                                            <span>{selectedStore.average_rating || '4.5'}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <FaUsers className={styles.icon} />
                                            <span>{selectedStore.count_followers || '0'} متابع</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <FaMapMarkerAlt className={styles.icon} />
                                            <span>{selectedStore.city || 'غير محدد'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.storeActions}>
                                    <FaPhone    color='rgba(147, 148, 151, 0.57)' />
                            
                                    <FaEnvelope  color='rgba(147, 148, 151, 0.57)' />
                                
                                    <FaClock     color='rgba(147, 148, 151, 0.57)' />
                                
                            </div>

                            {selectedStore.description && (
                                <div className={styles.storeDescription}>
                                    <h3>وصف المتجر</h3>
                                    <p>{selectedStore.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Chats