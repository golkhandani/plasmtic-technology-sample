import "reflect-metadata";

import { Pet, PetStatus } from "./pet.entity";
import * as AWS from "aws-sdk";
import { AttributeValue, GetItemInput, PutItemInput, QueryInput, ScanInput } from "aws-sdk/clients/dynamodb";
import { classToPlain } from "class-transformer";
import { getTableName } from "../../shared/dynamo-db";








export class PetRepo {
  private readonly tableName = getTableName(Pet.name);
  constructor(private readonly dynamoClient: AWS.DynamoDB.DocumentClient) {

  }
  public async create(item: Pet): Promise<Pet> {
    const params: PutItemInput = {
      TableName: this.tableName,
      Item: classToPlain(item),
    };
    await this.dynamoClient.put(params).promise();
    return item;
  }

  public async findByStatus(statuses: PetStatus[] | PetStatus): Promise<Pet[]> {
    const params: QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: "#status = :st",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":st": "available" as AttributeValue
      }

    };
    return (await this.dynamoClient.query(params).promise()).Items as Pet[];
  }

  //   public async findOne(): Promise<Pet> {}

  //   public async update(): Promise<Pet> {}

  //   public async delete(): Promise<Pet> {}


}
