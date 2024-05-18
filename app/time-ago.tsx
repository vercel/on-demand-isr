'use client';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export function Time({ time }) {
  return timeAgo.format(new Date(time));
}
