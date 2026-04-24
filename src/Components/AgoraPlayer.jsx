import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const AgoraPlayer = ({ streamId, role = 'subscriber', uid = null, className = '' }) => {
  const videoRef = useRef(null);
  const [client, setClient] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let init = async () => {
      try {
        // Get RTC token
        const tokenResponse = await fetch(`/api/live-streams/${streamId}/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: uid || Date.now(), role })
        });
        
        if (!tokenResponse.ok) throw new Error('Failed to get RTC token');
        const { channel, token, appId } = await tokenResponse.json();

        // Create client
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        setClient(agoraClient);

        // Publisher mode
        if (role === 'publisher') {
          const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
          setLocalVideoTrack(localVideoTrack);
          
          if (videoRef.current) {
            localVideoTrack.play(videoRef.current);
          }

          await agoraClient.join(appId, channel, token, uid || null);
          setIsJoined(true);
          
          agoraClient.on('user-published', async (user, mediaType) => {
            await agoraClient.subscribe(user, mediaType);
            if (mediaType === 'video' && user.videoTrack) {
              user.videoTrack.play(videoRef.current);
            }
          });
          
          await agoraClient.publish([localVideoTrack]);
        } 
        // Subscriber mode
        else {
          await agoraClient.join(appId, channel, token, uid || null);
          setIsJoined(true);
          
          agoraClient.on('user-published', async (user, mediaType) => {
            await agoraClient.subscribe(user, mediaType);
            if (mediaType === 'video' && user.videoTrack) {
              user.videoTrack.play(videoRef.current);
            }
          });

          agoraClient.on('user-unpublished', (user, mediaType) => {
            if (mediaType === 'video' && user.videoTrack) {
              user.videoTrack.stop();
            }
          });

          agoraClient.on('user-left', (user) => {
            setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
          });
        }

      } catch (err) {
        console.error('Agora init error:', err);
        setError(err.message);
      }
    };

    if (streamId) init();

    return () => {
      if (localVideoTrack) {
        localVideoTrack.close();
      }
      if (client && isJoined) {
        client.leave();
      }
    };
  }, [streamId, role, uid]);

  return (
    <div className={`agora-player ${className}`}>
      {error ? (
        <div className="alert alert-danger">
          Stream unavailable: {error}
        </div>
      ) : (
        <div 
          ref={videoRef} 
          className="agora-video"
          style={{ 
            width: '100%', 
            height: '100%', 
            background: '#000',
            borderRadius: '12px',
            minHeight: '240px'
          }}
        />
      )}
      {!isJoined && (
        <div className="position-absolute top-50 start-50 translate-middle text-white">
          <div className="spinner-border" />
          <p className="mt-2">Connecting...</p>
        </div>
      )}
    </div>
  );
};

export default AgoraPlayer;

