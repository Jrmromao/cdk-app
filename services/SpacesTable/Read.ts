import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from DynamoDb",
  };

  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        result.body = await queryWithPrimaryPartition(
          event.queryStringParameters
        );
      } else
        result.body = await queryWithPrimarySecondary(
          event.queryStringParameters
        );
    } else {
      result.body = await scanTable();
    }
  } catch (error: any) {
    result.body = error.message;
  }

  return result;
}

async function queryWithPrimarySecondary(
  queryParams: APIGatewayProxyEventQueryStringParameters
) {
  const queryKey = Object.keys(queryParams)[0];
  const queryVal = queryParams[queryKey];
  const queryResponse = await dbClient
    .query({
      TableName: TABLE_NAME!,
      IndexName: queryKey,
      KeyConditionExpression: "#zz = :zzzz",
      ExpressionAttributeNames: {
        "#zz": queryKey,
      },
      ExpressionAttributeValues: {
        ":zzzz": queryVal,
      },
    })
    .promise();

  return JSON.stringify(queryResponse);
}

async function scanTable() {
  const queryResponse = await dbClient
    .scan({
      TableName: TABLE_NAME!,
    })
    .promise();
  return JSON.stringify(queryResponse);
}

async function queryWithPrimaryPartition(
  queryParams: APIGatewayProxyEventQueryStringParameters
) {
  const keyVal = queryParams[PRIMARY_KEY!];
  const queryResponse = await dbClient
    .query({
      TableName: TABLE_NAME!,
      KeyConditionExpression: "#zz = :zzzz",
      ExpressionAttributeNames: {
        "#zz": PRIMARY_KEY!,
      },
      ExpressionAttributeValues: {
        ":zzzz": keyVal,
      },
    })
    .promise();
  return JSON.stringify(queryResponse);
}
export { handler };
