"use client"

import React, { useState, useEffect } from 'react';

export default function UserTime({time,className}) {
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const convertToClientTime = () => {
      const utcTime = new Date(`2000-01-01T${time}:00Z`);
      const localTime = utcTime.toLocaleTimeString('en-US', 
	{ 
	  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	  hour12: true,
          hour: '2-digit',
          minute: '2-digit'
	}
      );
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

