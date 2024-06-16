"use client"

import React, { useState, useEffect } from 'react';

export default function UserTime({time,className}) {
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const convertToClientTime = () => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes));
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    const localTime = utcDate.toLocaleString('en-US', options);
    setLocalTime(localTime);
    };

    convertToClientTime();
  }, []);

  return (
    <time className={className && className}>
      {localTime}
    </time>
  );
};

