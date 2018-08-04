import uuid from 'uuid';
import AWS from 'aws-sdk';

// dynamoDB configuration
AWS.config.update({ region: 'us-east-2' });
// create new dynamoDB document client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// export a function
export function main(event, context, callback) {
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
  // call putItem with the params above to create a new item (note) in the 'notes' table
  dynamoDB.putItem(params, (error, data) => {
    // set response headers (JSON) to enable CORS
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };
    // error handling
    if (error) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ status: false });
      };
      callback(null, response);
      return;
    }
    // success response
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item);
    };
    callback(null, response);
  });
}
