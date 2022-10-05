import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: 'todos',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    },
  }).promise();

  const todo = response.Items[0];

  if (!todo) {
    return {
      statusCode: 400,
      body: JSON.stringify('TODO does not exists!'),
    };
  }

  const responseUpdate = await document.update({
    TableName: 'todos',
    Key: { id: todo.id },
    UpdateExpression: 'SET done = :done',
    ExpressionAttributeValues: {
      ':done': !todo.done,
    },
    ReturnValues: 'ALL_NEW',
  }).promise();

  const todoDone = responseUpdate.Attributes;

  return {
    statusCode: 200,
    body: JSON.stringify(todoDone),
  };
}
