import api from '../config/api';

export const getLiveStreams = async () => {
  const response = await api.get('/live-streams/');
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
