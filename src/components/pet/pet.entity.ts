import * as uuid from "uuid";

import { getTableName } from "../../shared/dynamo-db";

export class PetCategory {
  public id: string;
  public name: string;
}

export class PetTag {
  public id: string;
  public name: string;
}

export enum PetStatus {
  available = "available",
  pending = "pending",
  sold = "sold",
}

export class Pet {
  public id: string;
  public category: PetCategory;
  public name: string;
  public photoUrls: string[];
  public tags: PetTag[];
  public status: PetStatus;

  constructor(data: Partial<Pet>) {
    if (data) {
      this.id = data.id || uuid.v4();
      return Object.assign(this, data);
    }
  }
}


const pet = {
  TableName: getTableName(Pet.name),
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