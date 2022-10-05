import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from '../utils/dynamodbClient';
import { v4 as uuidV4 } from 'uuid';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userId: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body);

  if (!title) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Title missing!',
      }),
    };
  }

  if (!deadline) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Deadline missing!',
      }),
    };
  }

  const id = uuidV4();

  await document.put({
    TableName: 'todos',
    Item: {
      id,
      user_id,
      title,
      deadline: new Date(deadline).toISOString(),
      done: false,
    }
  }).promise();

  const response = await document.query({
    TableName: 'todos',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    },
  }).promise();

  const createdTodo = response.Items[0];

  return {
    statusCode: 201,
    body: JSON.stringify(createdTodo),
  };
}
