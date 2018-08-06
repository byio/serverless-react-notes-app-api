import uuid from 'uuid';

import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

// export async function
export async function main(event, context, callback) {
  // parse request body
  const data = JSON.parse(event.body);
  // define params
  const params = {
    TableName: 'notes',
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attacment: data.attachment,
      createdAt: Date.now()
    }
  };
  // await
  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }
}
