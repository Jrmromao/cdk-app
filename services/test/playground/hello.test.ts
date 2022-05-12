import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../SpacesTable/Update";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "e29d3ab1-c535-4d95-ad16-78cac170403a",
  },
  body: {
    location: "new location",
  },
} as any;

const reault = handler(event, {} as any).then((apiResult) => {
  const items = JSON.parse(apiResult.body);
  console.log(123);
});
