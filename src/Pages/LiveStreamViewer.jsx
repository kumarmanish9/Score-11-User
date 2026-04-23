import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraPlayer from '../Components/AgoraPlayer';
import io from 'socket.io-client';
import { getLiveStreamById } from '../Services/liveStreamService';
import { FaArrowLeft, FaComments, FaHeart, FaUsers, FaShare, FaEye, FaThumbsUp, FaUser, FaCrown, FaRegClock, FaVolumeUp, FaExpand, FaPause } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .stream-viewer-container {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
    min-height: 100vh;
  }

  /* Header */
  .stream-header {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 20px 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .back-btn {
    background: rgba(255,255,255,0.1);
    border: none;
    padding: 10px 20px;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .back-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: translateX(-2px);
  }

  .stream-title {
    font-size: 24px;
    font-weight: 800;
    color: white;
    margin-bottom: 8px;
  }

  .stream-description {
    color: rgba(255,255,255,0.7);
    margin-bottom: 0;
  }

  /* Video Player */
  .video-wrapper {
    position: relative;
    background: #000;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }

  .video-controls-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    padding: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .video-wrapper:hover .video-controls-overlay {
    opacity: 1;
  }

  .live-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    background: #dc2626;
    color: white;
    padding: 8px 16px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 2;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }

  .viewer-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(10px);
    color: white;
    padding: 8px 16px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 2;
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .like-btn {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid rgba(220, 38, 38, 0.5);
    color: #dc2626;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .like-btn:hover {
    background: rgba(220, 38, 38, 0.4);
    transform: translateY(-2px);
  }

  .like-btn.liked {
    background: #dc2626;
    color: white;
  }

  .share-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .share-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }

  /* Chat Section */
  .chat-container {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .chat-header {
    background: rgba(0, 0, 0, 0.8);
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .chat-header h6 {
    font-size: 16px;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    max-height: 500px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .chat-message {
    animation: fadeInUp 0.3s ease-out;
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .message-avatar {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
  }

  .message-avatar.viewer {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
  }

  .message-name {
    font-size: 13px;
    font-weight: 700;
    color: #60a5fa;
  }

  .message-name.viewer {
    color: #a78bfa;
  }

  .message-time {
    font-size: 10px;
    color: rgba(255,255,255,0.4);
    margin-left: auto;
  }

  .message-text {
    font-size: 14px;
    color: rgba(255,255,255,0.9);
    margin-left: 36px;
    word-wrap: break-word;
  }

  .chat-input-form {
    padding: 16px 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
    background: rgba(0, 0, 0, 0.4);
  }

  .chat-input {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 12px 16px;
    color: white;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .chat-input:focus {
    background: rgba(255,255,255,0.15);
    border-color: #dc2626;
    outline: none;
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
  }

  .chat-input::placeholder {
    color: rgba(255,255,255,0.5);
  }

  .send-btn {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    color: white;
    transition: all 0.2s ease;
  }

  .send-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  }

  /* Stream Info */
  .stream-info-card {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 20px;
    margin-top: 20px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255,255,255,0.7);
    font-size: 14px;
  }

  /* Scrollbar */
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
  }

  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.3);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Loading Spinner */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
  }

  .custom-spinner {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(220, 38, 38, 0.2);
    border-top-color: #dc2626;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .stream-title {
      font-size: 18px;
    }
    .stream-description {
      font-size: 12px;
    }
    .live-badge, .viewer-badge {
      padding: 4px 12px;
      font-size: 10px;
    }
    .chat-messages {
      max-height: 300px;
    }
    .like-btn, .share-btn {
      padding: 8px 16px;
      font-size: 12px;
    }
  }
`;

const LiveStreamViewer = () => {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage or context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    
    let socketConn;
    
    const init = async () => {
      try {
        const streamData = await getLiveStreamById(streamId);
        setStream(streamData);
        setLikeCount(streamData.likes || 0);
        
        socketConn = io(process.env.REACT_APP_SOCKET_URL || '/', {
          transports: ['websocket'],
          autoConnect: true
        });
        setSocket(socketConn);

        socketConn.emit('joinStream', { streamId, userId: user._id });
        
        socketConn.on('viewerJoined', (data) => {
          setViewerCount(data.viewerCount);
        });
        
        socketConn.on('viewerLeft', (data) => {
          setViewerCount(data.viewerCount);
        });
        
        socketConn.on('newChatMessage', (message) => {
          setChatMessages(prev => [...prev, { ...message, timestamp: new Date() }]);
        });
        
        socketConn.on('streamLiked', (data) => {
          setLikeCount(data.likeCount);
        });
        
        socketConn.on('previousMessages', (messages) => {
          setChatMessages(messages);
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Stream load error:', err);
        setLoading(false);
      }
    };

    init();

    return () => {
      if (socketConn && streamId) {
        socketConn.emit('leaveStream', { streamId, userId: currentUser?._id });
        socketConn.disconnect();
      }
    };
  }, [streamId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && currentUser) {
      socket.emit('sendChatMessage', { 
        streamId, 
        message: newMessage,
        userId: currentUser._id,
        userName: currentUser.name
      });
      setNewMessage('');
    }
  };

  const handleLike = () => {
    if (!liked && socket) {
      setLiked(true);
      socket.emit('likeStream', { streamId, userId: currentUser?._id });
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/live/${streamId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard! Share with your friends.');
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="custom-spinner"></div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="stream-viewer-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center p-5">
          <div className="mb-4">
            <FaComments size={60} style={{ color: 'rgba(255,255,255,0.3)' }} />
          </div>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>Stream not found</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
            The stream you're looking for doesn't exist or has ended.
          </p>
          <button className="back-btn" onClick={() => navigate('/live')}>
            <FaArrowLeft /> Back to Live Streams
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="stream-viewer-container">
        {/* Header */}
        <div className="stream-header">
          <div className="container">
            <button className="back-btn" onClick={() => navigate('/live')}>
              <FaArrowLeft /> Back to Live Streams
            </button>
            <h1 className="stream-title mt-3">{stream.title}</h1>
            <p className="stream-description">{stream.description}</p>
          </div>
        </div>

        <div className="container py-4">
          <div className="row g-4">
            {/* Video Player Section */}
            <div className="col-lg-8">
              <div className="video-wrapper">
                <div className="live-badge">
                  <span>●</span> LIVE NOW
                </div>
                <div className="viewer-badge">
                  <FaUsers /> {viewerCount || stream.viewerCount || 0} Watching
                </div>
                <AgoraPlayer 
                  streamId={streamId} 
                  role="subscriber"
                  className="w-100"
                  style={{ aspectRatio: '16/9', width: '100%' }}
                />
              </div>
              
              <div className="action-buttons">
                <button 
                  className={`like-btn ${liked ? 'liked' : ''}`}
                  onClick={handleLike}
                  disabled={liked}
                >
                  <FaHeart /> {likeCount} {liked ? 'Liked' : 'Like'}
                </button>
                <button className="share-btn" onClick={handleShare}>
                  <FaShare /> Share
                </button>
              </div>

              {/* Stream Info */}
              <div className="stream-info-card">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="info-item">
                      <FaUser />
                      <span>Streamer: <strong>{stream.streamerName || 'Anonymous'}</strong></span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <FaRegClock />
                      <span>Started: {new Date(stream.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <FaThumbsUp />
                      <span>Total Likes: {likeCount}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <FaEye />
                      <span>Total Views: {stream.totalViews || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="col-lg-4">
              <div className="chat-container">
                <div className="chat-header">
                  <h6>
                    <FaComments />
                    Live Chat ({chatMessages.length})
                  </h6>
                </div>
                
                <div className="chat-messages">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-5">
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                        No messages yet. Be the first to chat!
                      </p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} className="chat-message">
                        <div className="message-header">
                          <div className={`message-avatar ${msg.userId === stream?.streamerId ? 'streamer' : 'viewer'}`}>
                            {msg.userName?.[0]?.toUpperCase() || 'A'}
                          </div>
                          <span className={`message-name ${msg.userId === stream?.streamerId ? 'streamer' : 'viewer'}`}>
                            {msg.userName || 'Anonymous'}
                            {msg.userId === stream?.streamerId && <FaCrown size={10} style={{ marginLeft: '4px', color: '#fbbf24' }} />}
                          </span>
                          <span className="message-time">
                            {formatTime(msg.timestamp || new Date())}
                          </span>
                        </div>
                        <div className="message-text">
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={sendMessage} className="chat-input-form">
                  <div className="input-group">
                    <input
                      className="chat-input form-control"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      maxLength="200"
                    />
                    <button className="send-btn" type="submit" disabled={!newMessage.trim()}>
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveStreamViewer;