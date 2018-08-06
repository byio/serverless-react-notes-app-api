import AWS from 'aws-sdk';

// dynamoDB configuration
AWS.config.update({ region: 'us-east-2' });

export function call(action, params) {
  // create new dynamoDB document client
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  return dynamoDB[action](params).promise();
}
