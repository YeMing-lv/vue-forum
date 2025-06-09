// utils/timeUtils.js
import moment from 'moment-timezone';

export function formatUTCtoLocal(utcTime, timeZone = 'Asia/Shanghai', formatStr = 'YYYY-MM-DD HH:mm:ss') {
  return moment.tz(utcTime, timeZone).format(formatStr);
}