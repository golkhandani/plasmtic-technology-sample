import "reflect-metadata";

import * as AWS from "aws-sdk";
import { AttributeValue, CreateTableInput, GetItemInput, PutItemInput, QueryInput, ScanInput } from "aws-sdk/clients/dynamodb";
import { classToPlain } from "class-transformer";
import { dynamodb, getTableName } from "../../shared/dynamo-db";
import { StoreOrder } from "./store-entity";








export class StoreRepo {
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
