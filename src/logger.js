import dayjs  from 'dayjs';
import utc  from 'dayjs/plugin/utc';
import fs from 'fs';

const baseDir = "scratchPad";
const logName = "log.txt";

export function log(method, url, status) {
    dayjs.extend(utc);
    let nowUTC = dayjs().utc().format();
    let data = `${method},${url},${status},${nowUTC}\n`;
    fs.appendFile(`./${baseDir}/${logName}`, data, function(error) {
        if(error) {
            console.log(`--- Logger Error Appending To Log File ${error}---`);
        }
    });
}