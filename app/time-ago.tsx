'use client';

import { useState, useEffect } from 'react';

function formatDate(date: string) {
  const currentDate = new Date().getTime();
  const targetDate = new Date(date).getTime();
  const timeDifference = currentDate - targetDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 2) {
    return '1 second ago';
  } else if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 2) {
    return '1 minute ago';
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 2) {
    return '1 hour ago';
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 2) {
    return '1 day ago';
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks < 2) {
    return '1 week ago';
  } else if (weeks < 4) {
    return `${weeks} weeks ago`;
  } else if (months < 2) {
    return '1 month ago';
  } else if (months < 12) {
    return `${months} months ago`;
  } else if (years < 2) {
    return '1 year ago';
  } else {
    return `${years} years ago`;
  }
}

export function Time({ time }: { time: string }) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setFormattedDate(formatDate(time));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return <span>{formattedDate}</span>;
}
