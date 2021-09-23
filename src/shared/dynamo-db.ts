import AWS = require("aws-sdk");
import { Pet } from "../components/pet/pet.entity";
export const getTableName = (entity: string) =>
  process.env.DYNAMODB + "-" + entity;
  
  export const dynamodb = new AWS.DynamoDB({
  region: "localhost",
endpoint: "http://localhost:8000",
accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
secretAccessKey: "DEFAULT_SECRET", // needed if you don't have aws credentials at all in env
});


export const dynamo = new AWS.DynamoDB();

export const dynamoClient = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
  secretAccessKey: "DEFAULT_SECRET", // needed if you don't have aws credentials at all in env
});
