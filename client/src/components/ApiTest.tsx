'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:8080/test');
        setStatus('Connected: ' + response.data.message);
      } catch (error: any) {
        setStatus('Error: ' + error.message);
        console.error('Connection test error:', error);
      }
    };

    testConnection();
  }, []);

  return <div>API Status: {status}</div>;
};

export default ApiTest; 