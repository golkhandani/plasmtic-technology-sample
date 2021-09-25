import * as AWS from "aws-sdk";
import { AWSConstants } from "./constants";

export const eventBridge = new AWS.EventBridge(AWSConstants);
