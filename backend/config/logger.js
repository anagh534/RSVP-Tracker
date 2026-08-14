const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const env = process.env.NODE_ENV || 'development';

const laravelFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  const metaStr = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
  return `[${timestamp}] ${env}.${level.toUpperCase()}: ${message} ${metaStr}`;
});

const logger = winston.createLogger({
  level: env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    laravelFormat
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

module.exports = logger;
