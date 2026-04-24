import api from '../config/api';

export const getLiveStreams = async () => {
  const response = await api.get('/live-streams/');
  return response.data.data || [];
};

export const getMyStreams = async () => {
  const response = await api.get('/live-streams/my/streams');
  return response.data.data || [];
};

export const getLiveStreamById = async (id) => {
  const response = await api.get(`/live-streams/${id}`);
  return response.data.data;
};

export const goLive = async (data) => {
  const response = await api.post('/live-streams/', data);
  return response.data;
};

// Get Agora RTC token for stream
export const getRtcToken = async (streamId) => {
  const response = await api.post(`/live-streams/${streamId}/token`, {
    uid: Date.now(), // unique user ID
    role: 'publisher' // or 'subscriber' for viewers
  });
  return response.data;
};
