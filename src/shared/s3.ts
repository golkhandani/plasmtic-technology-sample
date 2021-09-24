import * as AWS from "aws-sdk";
import { AWSConstants } from "./constants";

export const S3 = new AWS.S3({
    s3ForcePathStyle: true,
    ...AWSConstants
});

