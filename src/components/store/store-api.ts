"use strict";

import * as AWS from "aws-sdk";
import { dynamoClient } from "../../shared/dynamo-db";
import { StoreRepo } from "./store-epo";

const repo = new StoreRepo(dynamoClient)
import { APIGatewayEvent, Context, ProxyCallback } from "aws-lambda";
import { StoreOrder, StoreOrderStatus } from "./store-entity";
import { validateAndTransformRequest } from "../../shared/helper/validate-transform.helper";
import { StoreOrderCreateDTO } from "./dto/store-order-create-dto";
import { PetFindByIdDTO } from "./dto/store-order-find-by-id-dto";
import { wLogger } from "../../shared/winston";




export const create = async (
  event: APIGatewayEvent,
  context: Context,
) => {

  const validated = await validateAndTransformRequest(JSON.parse(event.body), StoreOrderCreateDTO)
  if (validated.error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify(validated.error),
    };
    return response;
  }

  const storeOrder = new StoreOrder(validated.data);
  const result = await repo.create(storeOrder);

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;

};

export const findAll = async (
  event: APIGatewayEvent,
  context: Context,
) => {
  wLogger.error("Hi")
  console.log("Hi")
  const result = await repo.findAll();

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;

};

export const findById = async (
  event: APIGatewayEvent,
  context: Context,
) => {

  console.log(event.pathParameters);

  const validated = await validateAndTransformRequest<PetFindByIdDTO>(event.pathParameters, PetFindByIdDTO)
  if (validated.error) {
    console.log(validated);
    const response = {
      statusCode: 400,
      body: JSON.stringify(validated.error),
    };
    return response;
  }

  console.log(validated.data)

  const result = await repo.findById(validated.data.id);

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;

};

export const deleteById = async (
  event: APIGatewayEvent,
  context: Context,
) => {

  const validated = await validateAndTransformRequest<PetFindByIdDTO>(event.pathParameters, PetFindByIdDTO)
  if (validated.error) {
    console.log(validated);
    const response = {
      statusCode: 400,
      body: JSON.stringify(validated.error),
    };
    return response;
  }

  await repo.delete(validated.data.id);

  const response = {
    statusCode: 204,
  };
  return response;

};