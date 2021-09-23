"use strict";

import * as AWS from "aws-sdk";
import { dynamoClient } from "../../shared/dynamo-db";
import { PetRepo } from "./pet.repo";

const repo = new PetRepo(dynamoClient)
import { APIGatewayEvent, Context, ProxyCallback } from "aws-lambda";
import { Pet, PetStatus } from "./pet.entity";
import { validateAndTransformRequest } from "../../shared/helper/validate-transform.helper";
import { PetCreateDTO } from "./dto/pet-create.dto";
import { PetFindByStatusDTO } from "./dto/pet-find-by-status.dto";






export const create = async (
  event: APIGatewayEvent,
  context: Context,
) => {

  const validated = await validateAndTransformRequest(JSON.parse(event.body), PetCreateDTO)
  if (validated.error) {
    console.log(validated);

    const response = {
      statusCode: 400,
      body: JSON.stringify(validated.error),
    };
    return response;
  }

  console.log(validated.data)

  const pet = new Pet(validated.data);
  const result = await repo.create(pet);

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;

};


export const findByStatus = async (
  event: APIGatewayEvent,
  context: Context,
) => {


  const validated = await validateAndTransformRequest(event.queryStringParameters, PetFindByStatusDTO)
  if (validated.error) {
    console.log(validated);
    const response = {
      statusCode: 400,
      body: JSON.stringify(validated.error),
    };
    return response;
  }

  console.log(validated.data)

  const result = await repo.findByStatus(validated.data.status);

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;

};

