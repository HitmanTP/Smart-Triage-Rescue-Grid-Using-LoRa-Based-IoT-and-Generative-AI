import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTriageReports = async () => {
  const response = await api.get('/triage');
  return response.data;
};

export const fetchNodes = async () => {
  const response = await api.get('/nodes');
  return response.data;
};

export const updateDispatchStatus = async (id, status) => {
  const response = await api.patch(`/triage/${id}/status`, { status });
  return response.data;
};

export const overridePriority = async (id, priority) => {
  const response = await api.patch(`/triage/${id}/priority`, { priority });
  return response.data;
};

export const toggleMuteNode = async (nodeId) => {
  const response = await api.patch(`/nodes/${nodeId}/mute`);
  return response.data;
};

export default api;
