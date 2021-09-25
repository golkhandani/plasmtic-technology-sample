
# Serverless AWS with Typescript


## Used Technologies
|Name| Link |
| -- | ---- |
| Serverless Framework | https://www.serverless.com |
| AWS Lambda | https://aws.amazon.com/lambda |
| AWS DynamoDB | https://aws.amazon.com/dynamodb |
| AWS CloudWatch | https://aws.amazon.com/cloudwatch |
| AWS S3 | https://aws.amazon.com/s3 |

## Packages
|Name| Link |
| -- | ---- |
| aws-lambda | https://www.npmjs.com/package/aws-lambda |
| aws-sdk | https://www.npmjs.com/package/aws-sdk |
| busboy | https://www.npmjs.com/package/busboy |
| class-transformer | https://github.com/typestack/class-transformer |
| class-validator | https://github.com/typestack/class-validator |
| reflect-metadata | https://www.npmjs.com/package/reflect-metadata |
| uuid | https://www.npmjs.com/package/uuid |
| winston | https://www.npmjs.com/package/winston |
| winston-cloudwatch | https://www.npmjs.com/package/winston-cloudwatch |


## Plugins
|Name| Link |
| -- | ---- |
| serverless-dotenv-plugin | https://www.serverless.com/plugins/serverless-dotenv-plugin |
| serverless-offline | https://www.serverless.com/plugins/serverless-offline |
| serverless-plugin-typescript | https://www.serverless.com/plugins/serverless-plugin-typescript |
| serverless-dynamodb-local | https://www.serverless.com/plugins/serverless-dynamodb-local |
| serverless-s3-local | https://www.serverless.com/plugins/serverless-s3-local |


# Project structure
###### Module-based Folder structure
> baham logics folders will be added after a more detailed look

    .📦sample-project
    ├──📦src                      # Main Codes of Application
    |   ├──📂components           # Project Specific structure
    |   |   ├──📂 pet             # Pet Logics
    |   |   |   └── ...
    |   |   ├──📂 store           # Store Logics
    |   |   |   ├──📂 dto         # Mostly for Validation
    |   |   |   ├──*-entity       # Typescript Model for store
    |   |   |   ├──*-service      # Integration part (for example sending event, calling repo method, changing the return values,...)
    |   |   |   ├──*-repo         # Interacting with database part
    |   |   |   ├──*-api          # Handler parts
    |   |   |   └── ...
    |   ├──📂shared               # Shared file like database/helpers/logger/etc.
    ├──📂test                     # Test files (alternatively `spec`) 
    ├────📜 package.json
    ├────📜 docker-compose        # localstack docker compose for local test 
    ├────📜 tsconfig.json         # tsconfig
    ├────📜 tsconfig.build.json   # tsconfig
    ├────📜 .env                  # enviroments file for serverless 



# Running system locally using localstack

Run localstack using docker compose (or you can install it locally)
For more information about localstack look at the the [localstack](https://github.com/localstack/localstack)

```
$ docker-compose up
```

Setup credential in localstack environment and then set them in .env file located at root of the project!

# Running system locally using local-serverless-plugins

To install and run dynamoDB locally

Add following line to serverless configuration file

```
custom:
  dynamodb:
    stages:
      - test
```

```
$ npm install --save-dev serverless-dynamodb-local

$ serverless dynamodb start --migrate --inMemory --stage test 
```


To install and run s3 locally 

Add following line to serverless configuration file
```
resoureces:
  Resources:
    ...
    FileStorage:
      Type: AWS::S3::Bucket
      Properties:
      BucketName: bucket-name

s3:
  host: localhost
  directory: /tmp
```

```
$ npm install --save-dev serverless-s3-local
```




# Run serverless locally
To Run Service as standalone server
```
serverless offline
```

# Deploy serverless app on AWS

First config the AWS CLI using serverless CLI by running below command:

```
$ serverless config credentials --provider aws --key ***key*** --secret ***secret***
```

Then to deploy application on server:

```
$ serverless deploy --stage production --region eu-west-1 --verbose --force
```



# Before Deploying the Application

You have to create a user with needed permissions on AWS


### Fixing Upload File (Reading Binary)


1. Go to the API Gateway settings tab for your API and add multipart/form-data to the binary media types section.
2. Add Content-Type and Accept to the request headers for your proxy method
3. Add those same headers to the integration request headers
4. Re-deploy the API

1) https://stackoverflow.com/questions/41756190/api-gateway-post-multipart-form-data/41770688#41770688

2) https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-payload-encodings-configure-with-console.html

### Event Bridge

1. https://www.serverless.com/blog/eventbridge-use-cases-and-tutorial