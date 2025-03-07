import React, { useState, useEffect } from 'react';
import { getServerTime } from './api';

const TestBinance = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fetchTime = async () => {
      const serverTime = await getServerTime();
      if (serverTime) {
        setTime(serverTime.serverTime);
      }
    };

    fetchTime();
  }, []);

  return (
    <div>
      <h1>Test Binance API Connection</h1>
      <p>Server Time: {time}</p>
    </div>
  );
}

export default TestBinance;
