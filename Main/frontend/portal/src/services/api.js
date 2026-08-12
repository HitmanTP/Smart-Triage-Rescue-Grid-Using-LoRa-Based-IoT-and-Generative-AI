import axios from 'axios';

// Detect whether running directly on ESP32 AP (192.168.4.1) or local dev server
const isEsp32Host = window.location.hostname === '192.168.4.1';
const API_BASE_URL = isEsp32Host ? 'http://192.168.4.1/api' : 'http://localhost:5000/api';

export const submitSosForm = async (formData) => {
  const payload = {
    name: formData.name || 'Anonymous Victim',
    age: formData.age ? parseInt(formData.age, 10) : undefined,
    locationContext: formData.locationContext || 'Unknown Location',
    rawText: formData.rawText,
    nodeId: 1, // Default node ID when connected to local ESP32 AP
    type: 'MANUAL',
    hops: 1,
    rssi: -55,
  };

  const response = await axios.post(`${API_BASE_URL}/sos`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  return response.data;
};
