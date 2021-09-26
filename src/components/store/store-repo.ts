import "reflect-metadata";

import * as AWS from "aws-sdk";
import { AttributeValue, CreateTableInput, GetItemInput, PutItemInput, QueryInput, ScanInput } from "aws-sdk/clients/dynamodb";
import { classToPlain } from "class-transformer";
import { dynamoClient, dynamodb, getTableName } from "../../shared/dynamo-db";
import { InvertoryStatusCount, StoreOrder } from "./store-entity";
import { PetStatus } from "../pet/pet-entity";



export class StoreInventoryRepo {
  private readonly tableName = getTableName(InvertoryStatusCount.name);
  private initialized = false;
  constructor(private readonly dynamoClient: AWS.DynamoDB.DocumentClient) {

  }

  // 1.update based on creating new pet
  // 2.update based on submitting a new order
  public async update(status: PetStatus, count: number) {

    return await this.dynamoClient.update(
      {
        TableName: this.tableName,
        Key: {
          status: status,
        },
        UpdateExpression: "SET #ct = if_not_exists(#ct, :initial) + :num",
        ExpressionAttributeNames: {
          "#ct": "count"
        },
        ExpressionAttributeValues: {
          ":num": count,
          ":initial": 0,
        },
        ReturnValues: "UPDATED_NEW"
      }).promise();
  }

  public async findAll() {

    const params: QueryInput = {
      TableName: this.tableName,
    };
    const result = await this.dynamoClient.scan(params).promise();
    const data = {};
    result.Items.forEach((item: InvertoryStatusCount) => {
      data[item.status] = item.count;
    })
    return data;
  }
}

export const storeInventoryRepo = new StoreInventoryRepo(dynamoClient);



export class StoreOrderRepo {
  private readonly tableName = getTableName(StoreOrder.name);
  private initialized = false;
  constructor(private readonly dynamoClient: AWS.DynamoDB.DocumentClient) {

  }


  public async create(item: StoreOrder): Promise<StoreOrder> {

    const params: PutItemInput = {
      TableName: this.tableName,
      Item: classToPlain(item),
    };
    await this.dynamoClient.put(params).promise();
    return item;
  }

  public async findAll() {

    const params: QueryInput = {
      TableName: this.tableName,
    };
    return await this.dynamoClient.scan(params).promise();
  }

  public async findById(id: string): Promise<StoreOrder> {
    const params: GetItemInput = {
      TableName: this.tableName,
      Key: {
        "id": id as any,
      }

    };
    return (await this.dynamoClient.get(params).promise()).Item as StoreOrder;
  }

  //   public async update(): Promise<Pet> {}

  public async delete(id: string): Promise<void> {
    var params = {
      TableName: this.tableName,
      Key: {
        "id": id as any,
      },
    };
    await this.dynamoClient.delete(params).promise();
    return;
  }
}

export const storeOrderRepo = new StoreOrderRepo(dynamoClient);
