import AWS from "aws-sdk";
import { Readable } from "stream";


const fs = require("fs");

const bucketName: string = "cryptonewsfeed";
const region: string = "us-west-1";
const accessKeyId: string = process.env.ACCESS_KEY_ID_AWS || "";
const secretAccessKey: string = process.env.ACCESS_KEY_SECRET_AWS || "";
const useS3: boolean = process.env.NODE_ENV==='production';


AWS.config.update({ region });
const s3 = new AWS.S3({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// TODO, pull out local file handling into local_files.ts and us s3 only for s3!
// uploads a file to S3
export function uploadJsonFile(json: any, key: string) {
  if (!useS3) {
    // in dev we do not use s3, we just store the file locally
    let dir = "./data";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    // dir = `./data/${key}`;
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir);
    // }
    let file: string = "./data/";

    if (key) {
      file += `${key}.json`;
      fs.writeFileSync(file, JSON.stringify(json));
      console.log(`Development mode: stored json data locally in : ${file}`);
    } else {
      console.error("key undefined!!!");
    }
    return;
  }
}

//upload file to s3
export function uploadS3File(json: any, key: string) {
  const uploadParams = {
    Bucket: bucketName,
    Body: JSON.stringify(json),
    Key: `${key}`,
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

 // Helper function to convert stream to string
 async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', (error) => {
      console.error('Error in stream processing:', error);
      reject(error);  // Properly reject the promise on a stream error
    });
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}


export async function getJsonFile(key: string) {
  const downloadParams = {
    Key: key,
    Bucket: bucketName,
  };

  try {
    // Attempt to get the object from S3
    const metadata = await s3.headObject(downloadParams).promise();
    const lastModified = metadata.LastModified;
    const s3Response = await s3.getObject(downloadParams).createReadStream()

    if (s3Response && lastModified) {
      const now = new Date();
      const minutesDiff = (now.getTime() - lastModified.getTime()) / (1000 * 60);
      const bodyContents = await streamToString(s3Response as Readable);
     
      return JSON.parse(bodyContents);
    } else {
      throw new Error('Empty response body from S3');
    }
  } catch (error) {
    // Log and rethrow the error to be handled by the caller
    console.error('Failed to get or parse S3 object:', error);
    throw error;
  }
}
