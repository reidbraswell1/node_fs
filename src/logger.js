import dayjs  from 'dayjs';
import utc  from 'dayjs/plugin/utc';

export function log(method, url, status) {
    dayjs.extend(utc);
    let nowUTC = dayjs().utc().format();
    console.log(`UTC Timestamp = ${nowUTC}`);
}