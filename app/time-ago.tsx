import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { unstable_noStore } from 'next/cache';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export function Time({ time }) {
  unstable_noStore();
  return timeAgo.format(new Date(time));
}
