import * as winston from 'winston';
// import * as winstonMongoDB from 'winston-mongodb';
import { MongoDB } from 'winston-mongodb';

const options = {
    db: process.env.LOGS_DB,
    collection: 'logs',
    level: 'warning',
    metaKey: 'stack',
    format: winston.format.json()
    // format: winston.format.combine(
    //     // winston.format.errors({ stack: true }),
    //     // winston.format.timestamp(),
    //     winston.format.json(),
    //     winston.format.prettyPrint({}),
    // )

};

const jsonLogFileFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    // winston.format.timestamp(),
    // winston.format.json(),
    // winston.format.prettyPrint(),
);

// winston.add(new winston.transports.MongoDB(options));

export const logger = winston.createLogger({
    level: 'debug',
    // format: jsonLogFileFormat,
    transports: [
        new MongoDB(options),
        new winston.transports.Console({level:'info'}),
    ]
});