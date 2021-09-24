import * as uuid from "uuid";

import { getTableName } from "../../shared/dynamo-db";
import { PetStatus } from "../pet/pet-entity";

export class InvertoryStatusCount {
  public status: PetStatus;
  public count: number;
}

export enum StoreOrderStatus {
  placed = "placed"
}

export class StoreOrder {
  id: string;
  petId: string;
  quantity: number;
  shipDate: Date | string;
  status: StoreOrderStatus;
  complete: boolean;

  constructor(data: Partial<StoreOrder>) {
    if (data) {
      this.id = data.id || uuid.v4();
      return Object.assign(this, data);
    }
  }
}


