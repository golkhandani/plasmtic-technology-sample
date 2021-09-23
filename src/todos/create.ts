"use strict";

import * as uuid from "uuid";
import { APIGatewayEvent, Context, ProxyCallback } from "aws-lambda";
import dynamoDb from "../shared/dynamo-db";

export const create = (
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback
) => {
  console.log("Here in create", event.body);

  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.text !== "string") {
    console.error("Validation Failed");
    callback(new Error("Couldn't create the todo item."));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB + "-todo",
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error("Couldn't create the todo item."));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
