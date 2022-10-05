import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userId: user_id } = event.pathParameters;

  const response = await document.scan({
    TableName: 'todos',
    FilterExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': user_id,
    },
  }).promise();

  const todos = response.Items;

  return {
    statusCode: 200,
    body: JSON.stringify({ todos }),
  };
}
