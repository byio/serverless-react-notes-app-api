import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const params = {
    TableName: 'notes',
    // only return items with matching partition key, userId
    KeyConditionExpression: 'userId = :userId',
    // define value in the condition, :userId, to be Identity Pool identity id of auth user
    EpressionAttributeValues: {
      ':userId': event.requestContext.identity.cognito.IdentityId
    }
  };

  try {
    const result = await dynamoDbLib.call('query', params);
    // return list of items in response body
    callback(null, success(result.Items));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
