"use strict";

import { dynamoClient } from "../../shared/dynamo-db";
import { StoreInventoryRepo, StoreOrderRepo } from "./store-repo";
import { APIGatewayEvent, Context, EventBridgeEvent } from "aws-lambda";
import { StoreOrder } from "./store-entity";
import { validateAndTransformRequest } from "../../shared/helper/validate-transform.helper";
import { StoreOrderCreateDTO } from "./dto/store-order-create-dto";
import { PetFindByIdDTO } from "./dto/store-order-find-by-id-dto";
import { wLogger } from "../../shared/winston";
import { PetStatus } from "../pet/pet-entity";
import { response } from "../../shared/helper/api-response.helper";



const repo = new StoreOrderRepo(dynamoClient);
const invertory = new StoreInventoryRepo(dynamoClient);

// EventBridge Handler
export const increaceCategoryCountEvent = async (
  event: EventBridgeEvent<string, any>,
  context: Context,
) => {

  try {
    const data = JSON.parse(JSON.stringify(event?.detail || { status: PetStatus.available, count: 1 }));
    const result = await invertory.update(data.status, data.count);
    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    wLogger.log(error);
    return {
      statusCode: 500,
      body: error
    };
  }

}


export const create = response(async (
  event: APIGatewayEvent,
  context: Context,
) => {
  const validated = await validateAndTransformRequest(JSON.parse(event.body), StoreOrderCreateDTO);
  const storeOrder = new StoreOrder(validated.data);
  const result = await repo.create(storeOrder);
  return {
    statusCode: 200,
    body: result,
  };
});

export const findAll = response(async (
  event: APIGatewayEvent,
  context: Context,
) => {
  const result = await invertory.findAll();
  return {
    statusCode: 200,
    body: result,
  };
});

export const findById = response(async (
  event: APIGatewayEvent,
  context: Context,
) => {
  const validated = await validateAndTransformRequest<PetFindByIdDTO>(event.pathParameters, PetFindByIdDTO);
  const result = await repo.findById(validated.data.id);
  return {
    statusCode: 200,
    body: result,
  };
});

export const deleteById = response(async (
  event: APIGatewayEvent,
  context: Context,
) => {
  const validated = await validateAndTransformRequest<PetFindByIdDTO>(event.pathParameters, PetFindByIdDTO);
  await repo.delete(validated.data.id);
  return {
    statusCode: 204,
  };
});