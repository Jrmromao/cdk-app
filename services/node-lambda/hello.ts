import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3();

async function handler(event: any, context: any) {
  const buckets = await s3Client.listBuckets().promise();
  console.log("Got an event");
  console.log(event);

  return {
    statusCode: 200,
    bosy: "Here are ypur buckets ts"+JSON.stringify(buckets),
  };
}

export { handler };
