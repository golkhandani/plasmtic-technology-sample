/**
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
var fs = require('fs');
import { CreateTableInput } from "aws-sdk/clients/dynamodb";
import { Pet } from "./src/components/pet/pet-entity";
import { InvertoryStatusCount, StoreOrder } from "./src/components/store/store-entity";
import { dynamoClient, dynamodb, getTableName } from "./src/shared/dynamo-db";
import { S3 } from "./src/shared/s3";

process.env.DYNAMODB = "plasmatic-technology"


var Pets: CreateTableInput = {
    TableName: getTableName(Pet.name),
    GlobalSecondaryIndexes: [
        {
            IndexName: "pet_status",
            KeySchema: [
                { AttributeName: "status", KeyType: "HASH" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            },
            Projection: {
                "ProjectionType": "ALL"
            },
        }
    ],
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "status", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(Pets, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});




var StoreOrders: CreateTableInput = {
    TableName: getTableName(StoreOrder.name),
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(StoreOrders, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

var invertoryStatusCount: CreateTableInput = {
    TableName: getTableName(InvertoryStatusCount.name),
    KeySchema: [
        { AttributeName: "status", KeyType: "HASH" },  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "status", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(invertoryStatusCount, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

S3.createBucket({ Bucket: "local-bucker" }, (err, data) => {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});