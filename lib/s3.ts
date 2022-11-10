import AWS from "aws-sdk";
import { Readable } from "stream";

const fs = require("fs");

const bucketName: string = "cryptonewsfeed";
const region: string = "us-west-1";
const accessKeyId: string = process.env.ACCESS_KEY_ID_AWS || "";
const secretAccessKey: string = process.env.ACCESS_KEY_SECRET_AWS || "";
const useS3: boolean = true;

AWS.config.update({ region });
const s3 = new AWS.S3({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// TODO, pull out local file handling into local_files.ts and us s3 only for s3!
// uploads a file to S3
export function uploadJsonFile(json: any, key: string, type: string = "cards") {
  if (!useS3) {
    // in dev we do not use s3, we just store the file locally
    let dir = "./data";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    dir = `./data/${key}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let file: string = "./data/";
    if (key === "splinterlands") {
      file += `${key}/${key}-${type}.json`;
    } else if (key === "axie-infinity") {
      file += `${key}/${key}-${type}.json`;
    }
    if (key) {
      fs.writeFileSync("myname", JSON.stringify({ name: "anna", dog: "true" }));
      console.log(`Development mode: stored json data locally in : ${file}`);
    } else {
      console.error("key undefined!!!");
    }
    return;
  }

  const uploadParams = {
    Bucket: bucketName,
    Body: JSON.stringify(json),
    Key: `${key}-${type}`,
  };

  s3.upload(uploadParams, (error: Error, data: any) => {
    if (error) {
      console.log("Upload to S3 Failed!");
      console.log(error.message || "something went wrong!");
    }
    if (data) {
      console.log("Upload to S3 worked.");
    }
  });
}

// download a file from S3
export async function getJsonFile(key: string, type: string = "cards") {
  console.log(key, type);
  const downloadParams = {
    Key: `${key}-${type}`,
    Bucket: bucketName,
  };
  async function streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("erro", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
  }

  const body = await s3.getObject(downloadParams).createReadStream();

  const bodyContents = await streamToString(body as Readable);

  return JSON.parse(bodyContents);
}
