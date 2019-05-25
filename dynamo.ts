import {
  DynamoDBClient,
  GetItemInput,
  PutItemInput,
} from '@aws-sdk/client-dynamodb-v2-node';
import { GetItemCommand } from '@aws-sdk/client-dynamodb-v2-node/commands/GetItemCommand';
import { PutItemCommand } from '@aws-sdk/client-dynamodb-v2-node/commands/PutItemCommand';

const dynamoDB = new DynamoDBClient({});
const dynamoDBTable = process.env.dynamoDBTable;

export async function getState(): Promise<string> {
  const params: GetItemInput = {
    Key: {
      key: { S: 'state' },
    },
    TableName: dynamoDBTable,
  };
  const getItemCommand = new GetItemCommand(params);
  return await dynamoDB
    .send(getItemCommand)
    .then(res => {
      if (res.Item !== undefined) {
        return res.Item.value.S;
      } else {
        return 'not found';
      }
    })
    .catch(err => {
      throw err;
    });
}

export async function setState(state: string) {
  const params: PutItemInput = {
    Item: {
      key: { S: 'state' },
      timestamp: { N: String(Math.floor(Date.now() / 1000)) },
      value: { S: state },
    },
    TableName: dynamoDBTable,
  };
  const putItemCommand = new PutItemCommand(params);
  await dynamoDB.send(putItemCommand).catch(err => {
    console.log(err);
  });
}
