import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { db } from "./db";

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const result = await db.user.findMany();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (ex) {
    return {
      statusCode: 500,
      body: String(ex),
    };
  }
};
