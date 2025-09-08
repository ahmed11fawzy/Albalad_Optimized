import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 10,
    minutes: 0,
    seconds: 0
  });

  // تحويل الوقت الكلي إلى ثواني
  const initialTime = 10 * 60 * 60; // 10 ساعات × 60 دقيقة × 60 ثانية
  const [secondsLeft, setSecondsLeft] = useState(initialTime);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // تحويل الثواني إلى تنسيق ساعات:دقائق:ثواني
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <span style={{ direction: 'rtl', fontFamily: 'Arial', color: 'red' }}>
      ينتهي العرض خلال:  {formatTime(secondsLeft)}
    </span>
  );
};

export default CountdownTimer;