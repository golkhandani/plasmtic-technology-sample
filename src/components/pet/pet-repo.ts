import "reflect-metadata";

import { Pet, PetStatus } from "./pet-entity";
import * as AWS from "aws-sdk";
import { AttributeValue, CreateTableInput, GetItemInput, PutItemInput, QueryInput, ScanInput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { classToPlain } from "class-transformer";
import { dynamodb, getTableName } from "../../shared/dynamo-db";








export class PetRepo {
  private readonly tableName = getTableName(Pet.name);
  private initialized = false;
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

  public async findByStatus(statuses: PetStatus[]) {

    // TODO: Fix to use all item in array
    const params: QueryInput = {
      TableName: this.tableName,
      IndexName: "pet_status",
      KeyConditionExpression: "#st = :status",
      ExpressionAttributeNames: {
        "#st": "status",
      },
      ExpressionAttributeValues: {
        ":status": statuses[0] as any,
      }

    };
    return await this.dynamoClient.query(params).promise();
  }

  public async findById(id: string): Promise<Pet> {
    const params: GetItemInput = {
      TableName: this.tableName,
      Key: {
        "id": id as any,
      }

    };
    return (await this.dynamoClient.get(params).promise()).Item as Pet;
  }
  public async updateImage(id: string, imageUrl: string): Promise<any> {
    var params = {
      TableName: this.tableName,
      Key: {
        "id": id as any,
      },
      UpdateExpression: "set photoUrls = list_append(if_not_exists(photoUrls, :empty_list), :pu)",
      ExpressionAttributeValues: {
        ":pu": [imageUrl],
        ':empty_list': []

      },
      ReturnValues: "UPDATED_NEW"
    };

    return await this.dynamoClient.update(params).promise()
  }

  public async update(update: Partial<Pet>): Promise<any> {
    var params = {
      TableName: this.tableName,
      Key: {
        "id": update.id as any,
      },
      UpdateExpression: "set name = :name, category = :category, tags = :tags, status = :status, photoUrls = :pu, ",
      ExpressionAttributeValues: {
        ":pu": update.photoUrls,
        ":name": update.name,
        ":category": update.category,
        ":tags": update.tags,
        ":status": update.status,
        ':empty_list': []
      },
      ReturnValues: "UPDATED_NEW"
    };

    return await this.dynamoClient.update(params).promise();
  }

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
