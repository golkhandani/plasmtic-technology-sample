"use strict";

import * as AWS from "aws-sdk";
import { dynamoClient } from "../../shared/dynamo-db";
import { PetRepo } from "./pet-repo";

const repo = new PetRepo(dynamoClient)
import { APIGatewayEvent, Context, ProxyCallback } from "aws-lambda";
import { Pet, PetStatus } from "./pet-entity";
import { validateAndTransformRequest } from "../../shared/helper/validate-transform.helper";
import { PetCreateDTO } from "./dto/pet-create-dto";
import { PetFindByStatusDTO } from "./dto/pet-find-by-status-dto";
import { PetUpdateDTO } from "./dto/pet-update-dto"
import { PetFindByIdDTO } from "./dto/pet-find-by-id-dto";
import { multipartParser } from "../../shared/helper/form-parser.helper";
import { S3 } from "../../shared/s3";





export const uploadFile = async (
  event: APIGatewayEvent,
  context: Context,
) => {

  const uploadFile = await multipartParser(event);
  const id = event.pathParameters.id;
  const bucket = 'plasmatic-technolgy-s3'
  const file = id + '.jpg';

  const result = await S3.putObject({
    Bucket: bucket,
    Key: file,
    Body: uploadFile.content
  }).promise()
  const signedOriginalUrl = S3.getSignedUrl(
    "getObject", {
    Bucket: bucket,
    Key: file,
    Expires: 60000
  });

  const updated = await repo.updateImage(id, signedOriginalUrl);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      etag: result.ETag.toString(),
      url: signedOriginalUrl,
      updated
    }),
  };
  return response;


}

export const s3hook = (event, context) => {
};


export const update = async (
  event: APIGatewayEvent,
  context: Context,
) => {

  const validated = await validateAndTransformRequest(JSON.parse(event.body), PetUpdateDTO)
  if (validated.error) {
    console.log(validated);

    const response = {
      statusCode: 400,
      body: JSON.stringify(validated.error),
    };
    return response;
  }

  const pet = new Pet(validated.data);
  const result = await repo.create(pet);

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;

};
// TODO: pet/updatePetWithForm




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

  console.log(event.multiValueQueryStringParameters);

  const validated = await validateAndTransformRequest<PetFindByStatusDTO>(event.multiValueQueryStringParameters, PetFindByStatusDTO)
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