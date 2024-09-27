import { unstable_noStore } from 'next/cache';

function formatDate(date) {
  let currentDate = new Date().getTime();
  let targetDate = new Date(date).getTime();
  let timeDifference = currentDate - targetDate;

  let seconds = Math.floor(timeDifference / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let weeks = Math.floor(days / 7);
  let months = Math.floor(days / 30);
  let years = Math.floor(days / 365);

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

export function Time({ time }) {
  unstable_noStore();
  const formattedTime = formatDate(time);
  return <span suppressHydrationWarning>{formattedTime}</span>;
}
