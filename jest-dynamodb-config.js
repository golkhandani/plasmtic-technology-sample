module.exports = {
    tables: [
        // plasmatic-technology-Pet
        {
            TableName: "plasmatic-technology-Pet",
            GlobalSecondaryIndexes: [
                {
                    IndexName: "pet_status",
                    KeySchema: [
                        { AttributeName: "status", KeyType: "HASH" }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    },
                    Projection: {
                        "ProjectionType": "ALL"
                    },
                }
            ],
            KeySchema: [
                { AttributeName: "id", KeyType: "HASH" },  //Partition key
            ],
            AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "S" },
                { AttributeName: "status", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        },
        // plasmatic-technology-StoreOrder
        {
            TableName: "plasmatic-technology-StoreOrder",
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
        },
        // plasmatic-technology-InvertoryStatusCount
        {
            TableName: "plasmatic-technology-InvertoryStatusCount",
            KeySchema: [
                { AttributeName: "status", KeyType: "HASH" },  //Partition key
            ],
            AttributeDefinitions: [
                { AttributeName: "status", AttributeType: "S" },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }
    ],
};