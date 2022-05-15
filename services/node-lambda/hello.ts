import { APIGatewayProxyEvent } from "aws-lambda";
import { S3 } from "aws-sdk";

const s3Client = new S3();

async function handler(event: any, context: any) {
  if (isAuthorized(event))
    return {
      statusCode: 200,
      body: "You are Authorized!",
    };
  else
    return {
      statusCode: 401,
      body: "You are NOT authorized",
    };
}

const isAuthorized = (event: APIGatewayProxyEvent) => {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];

  if (groups) return (groups as string).includes("admins");
  else return false;
};
export { handler };
