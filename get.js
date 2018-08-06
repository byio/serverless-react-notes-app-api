import * as dynamoDbLib from './libs/dynamodb-lib';
import { sucess, failure } from './libs/response-lib';

// async
export async function main(event, context, callback) {
  // params
  const params = {
    TableName: 'notes',
    // define partition key and sort key of target item
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  }
  // await
  try {
    const result = await dynamoDbLib.call("get", params);
    // check if item was found
    if (result.Item) {
      // return target item
      callback(null, success(result.Item));
    } else {
      callback(null, failure({ status: false, error: 'Item not found' }));
    }
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
