import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  await document.delete({
    TableName: 'todos',
    Key: { id },
  }).promise();

  return {
    statusCode: 204,
    body: JSON.stringify({}),
  };
}
