"use strict";

import * as AWS from "aws-sdk";
import dynamoDb from "../shared/dynamo-db";

const params = {
  TableName: process.env.DYNAMODB + "-todo",
};

export const list = (event, context, callback) => {
  console.log("HIIIII", params);

  // fetch all todos from the database
  // For production workloads you should design your tables and indexes so that your applications can use Query instead of Scan.
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todo items.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
