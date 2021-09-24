import * as AWS from "aws-sdk";
import * as winston from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';
import { AWSConstants } from "./constants";

export const wLogger = winston.createLogger({
    transports: [
        new WinstonCloudWatch({
            cloudWatchLogs: new AWS.CloudWatchLogs(AWSConstants),
            logGroupName: 'log-group-name',
            logStreamName: 'log-stream-name',
            jsonMessage: true,
            name: "logger"
        })
    ]
});

