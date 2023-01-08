import * as winston from 'winston';
// import * as winstonMongoDB from 'winston-mongodb';
import { MongoDB } from 'winston-mongodb';
import { appSettings } from '../shared/app.settings';

const options = {
    db: process.env.LOGS_DB,
    options:{
        useUnifiedTopology: true,
    },

    collection: 'logs',
    level: 'warning',
    metaKey: 'stack',
    capped:true,
    cappedMax: appSettings.maxNumberOfLogsInMongoDb,
    format: winston.format.json()


};

const jsonLogFileFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    // winston.format.json(),
    winston.format.prettyPrint(),
);

// winston.add(new winston.transports.MongoDB(options));

export const logger = winston.createLogger({
    level: 'debug',
    format: jsonLogFileFormat,
    transports: [
        new MongoDB(options),
        // new winston.transports.Console({level:'info'}),
    ]
});

export function closeWinstonConnection(){
    logger.transports[0].close();
}