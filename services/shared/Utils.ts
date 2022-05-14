import {
    APIGatewayProxyEvent,
  } from "aws-lambda";


export const generateRandomId = (): string => {
  return Math.random().toString(36).slice(2);
};

export const getEventBody = (event: APIGatewayProxyEvent) => {
    return typeof event.body == "object" ? event.body : JSON.parse(event.body);
};
