import * as AWS from "aws-sdk";
import { AWSConstants } from "./constants";
export const getTableName = (entity: string) =>
  process.env.DYNAMODB + "-" + entity;

// For migration purpose only
export const dynamodb = new AWS.DynamoDB(AWSConstants);

// For Repository usage
export const dynamoClient = new AWS.DynamoDB.DocumentClient(AWSConstants);


