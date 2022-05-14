import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { generateRandomId, getEventBody } from "../shared/Utils";
import {
  MissingFildError,
  ValidateAsSpaceEntry,
} from "../shared/InputValidator";

const TABLE_NAME = process.env.TABLE_NAME;
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
    const item = getEventBody(event);

    item.spaceId = generateRandomId();
    ValidateAsSpaceEntry(item);
    await dbClient
      .put({
        TableName: "SpacesTable",
        Item: item,
      })
      .promise();
    result.body = JSON.stringify(`Created item with id: ${item.spaceId}`);
  } catch (error: any) {
    if (error instanceof MissingFildError) result.statusCode = 403;
    else result.statusCode = 500;

    result.body = error.message;
  }
  return result;
}

export { handler };
