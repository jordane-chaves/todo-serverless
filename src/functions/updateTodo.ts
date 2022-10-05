import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body);

  const response = await document.update({
    TableName: 'todos',
    Key: { id },
    UpdateExpression: 'SET title = :title, deadline = :deadline',
    ExpressionAttributeValues: {
      ':title': title,
      ':deadline': deadline,
    },
    ReturnValues: 'ALL_NEW',
  }).promise();

  const updatedTodo = response.Attributes;

  return {
    statusCode: 200,
    body: JSON.stringify(updatedTodo),
  };
}
