"use strict";

import { dynamoClient } from "../../shared/dynamo-db";
import { petRepo, PetRepo } from "./pet-repo";

import { APIGatewayEvent, Context } from "aws-lambda";
import { Pet } from "./pet-entity";
import { validateAndTransformRequest } from "../../shared/helper/validate-transform.helper";
import { PetCreateDTO } from "./dto/pet-create-dto";
import { PetFindByStatusDTO } from "./dto/pet-find-by-status-dto";
import { PetUpdateDTO } from "./dto/pet-update-dto"
import { PetFindByIdDTO } from "./dto/pet-find-by-id-dto";
import { multipartParser } from "../../shared/helper/form-parser.helper";
import { S3 } from "../../shared/s3";
import { wLogger } from "../../shared/winston";
import { response } from "../../shared/helper/api-response.helper";
import { eventBridge } from "../../shared/event-bridge";

import * as fs from "fs";



export const uploadFile = response(async (
  event: APIGatewayEvent,
  context: Context,
) => {

  const uploadFile = await multipartParser(event);
  const id = event.pathParameters.id;
  const bucket = 'plasmatic-technolgy-s3'
  const file = id + "_" + Date.now() + ".jpeg";

  const result = await S3.putObject({
    Bucket: bucket,
    Key: file,
    Body: uploadFile.content,
    ContentType: "image/jpeg"
  }).promise();

  const signedOriginalUrl = S3.getSignedUrl(
    "getObject", {
    Bucket: bucket,
    Key: file,
  });

  const updated = await petRepo.updateImage(id, signedOriginalUrl);
  const response = {
    statusCode: 200,
    body: {
      etag: result.ETag.toString(),
      url: signedOriginalUrl,
      updated
    },
  };
  return response;
})

export const update = response(async (
  event: APIGatewayEvent,
  context: Context,
) => {
  const validated = await validateAndTransformRequest(JSON.parse(event.body), PetUpdateDTO);
  const pet = new Pet(validated.data);
  const result = await petRepo.create(pet);
  const response = {
    statusCode: 200,
    body: result,
  };
  return response;

});

// TODO: pet/updatePetWithForm

export const create = response(async (
  event: APIGatewayEvent,
  context: Context,
) => {
  const validated = await validateAndTransformRequest(JSON.parse(event.body), PetCreateDTO)
  const pet = new Pet(validated.data);
  const eventbridgedata = await eventBridge.putEvents({
    Entries: [
      {
        EventBusName: 'inventory',
        Source: 'acme.pet.category',
        DetailType: 'IncreaceCategoryCountEvent',
        Detail: JSON.stringify({ status: pet.status, count: +1 })
      },
    ]
  }).promise();
  if (eventbridgedata) {
    wLogger.info("IncreaceCategoryCountEvent => ", "Has been called by create pet function!");
  }
  const result = await petRepo.create(pet);
  return {
    statusCode: 200,
    body: result,
  };
});

export const findByStatus = response(async (
  event: APIGatewayEvent,
  context: Context,
) => {
  const validated = await validateAndTransformRequest<PetFindByStatusDTO>(event.multiValueQueryStringParameters, PetFindByStatusDTO);
  const result = await petRepo.findByStatus(validated.data.status);
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
  const result = await petRepo.findById(validated.data.id);
  return {
    statusCode: 200,
    body: result,
  };
});

export const deleteById = async (
  event: APIGatewayEvent,
  context: Context,
) => {
  const validated = await validateAndTransformRequest<PetFindByIdDTO>(event.pathParameters, PetFindByIdDTO);
  await petRepo.delete(validated.data.id);
  return {
    statusCode: 204,
  };
};