import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'notes',
    // data (partition key and sort key) used to find specific note to update
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    },
    // expression to update note
    UpdateExpression: 'SET content = :content, attachment = :attachment',
    // define values for attributes used in expression
    ExpressionAttributeValues: {
      ":attachment": data.attachment ? data.attachment : null,
      ":content": data.content ? data.content : null
    },
    // returns all of the attributes of the item, as they appear after the Update operation
    ReturnValues: "ALL_NEW"
  }

  try {
    const result = await dynamoDbLib.call('update', params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
