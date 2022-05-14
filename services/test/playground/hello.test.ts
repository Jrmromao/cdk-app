import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../SpacesTable/Create";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "842d5c33-67c9-42f2-ae40-740ded920627",
  },
  body: {
    name: "some name",
  },
} as any;

const reault = handler(event, {} as any).then((apiResult) => {
  const items = JSON.parse(apiResult.body);

});
