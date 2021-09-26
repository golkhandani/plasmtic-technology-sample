import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as uuid from "uuid";



import { petRepo, PetRepo } from "../src/components/pet/pet-repo";
import { Pet, PetStatus } from "../src/components/pet/pet-entity";
import * as petAPI from "../src/components/pet/pet-api"

const isTest = process.env.JEST_WORKER_ID;
const config = {
    convertEmptyValues: true,
    ...(isTest && {
        endpoint: 'localhost:8000',
        sslEnabled: false,
        region: 'local-env',
    }),
};

beforeEach(() => {
    jest.useFakeTimers();
})

it('should insert item into table', async () => {
    const ddb = new DocumentClient(config);
    const repo = new PetRepo(ddb);


    const id = uuid.v4();
    const data: Pet = {
        "id": id,
        "category": {
            "id": uuid.v4(),
            "name": "string"
        },
        "name": "doggie",
        "photoUrls": [
            "string"
        ],
        "tags": [
            {
                "id": uuid.v4(),
                "name": "string"
            }
        ],
        "status": PetStatus.available
    };

    await repo.create(data)
    const { Item } = await ddb.get({ TableName: 'plasmatic-technology-Pet', Key: { id: id } }).promise();
    expect(Item).toEqual(data);
});





it('should insert item into handler', async () => {
    const data = {
        "category": {
            "id": uuid.v4(),
            "name": "string"
        },
        "name": "Hall",
        "photoUrls": [
            "string"
        ],
        "tags": [
            {
                "id": uuid.v4(),
                "name": "string"
            }
        ],
        "status": PetStatus.available
    };
    petRepo.create = jest.fn().mockImplementation(() => Object.assign(data, { id: uuid.v4() }));
    const event = { body: JSON.stringify(data) };
    const result = await petAPI.create(event, null);

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).data).toEqual(data);
});