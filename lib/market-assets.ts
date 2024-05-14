import { AWSError } from "aws-sdk";
import { getJsonFile, uploadJsonFile, uploadS3File } from "./s3";

const fs = require("fs");
const useS3: boolean = process.env.NODE_ENV==='production';


// export async function updateCards(key: any) {
//   try {
//     const getData = await getJsonFile("news", "feed");
//     return await getData;
//   } catch (e) {
//     const data = await fetch(
//       `https://newsapi.org/v2/everything?q=crypto&from=2022-11-08&sortBy=popularity&apiKey=${key}&language=en`
//     )
//       .then((response) => response.json())
//       .then((data) => data);

//     if ((await data.status) === "ok") {
//       uploadJsonFile(await data, "news", "feed");
//       return true;
//     }
//     return false;
//   }
// }

export async function marketMovers() {
  fetch("https://price-api.crypto.com/price/v1/top-movers?depth=10")
    .then(async (resMovers) => {
      console.log(await resMovers.text());
      const movers = await resMovers.json();
      console.log(movers);

      return movers;
    })
    .then((movers) => {
      const arr: string[] = [];
      movers.forEach((el: { name: string }) =>
        arr.push(el.name.replace(/[\. ,:-]+/g, "-").toLowerCase())
      );

      const str = arr.join("%2C");
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${str}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
      )
        .then((res) => res.json())
        .then((data) => {
          return data;
        });
    });
}

//Helper function to log errors
function logError(message: string, error: any) {
  console.error(`${message}:`, error);
}

// Helper function to read JSON from a file
async function readJsonFromFile(filePath: string): Promise<any> {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    logError("Error reading JSON from file", error);
    throw error; // Rethrow to handle this error in the calling code
  }
}

// Helper function to fetch global metrics from the API
async function fetchData(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    logError("Error fetching global metrics from the API", error);
    throw error; // Rethrow to handle this error in the calling code
  }
}

// Function to upload JSON file with timestamp
async function uploadJsonFileWithTimestamp(data: any, key: string) {
  try {
    const now = new Date();
    uploadJsonFile({ ...data, timestamp: now.getTime() }, key);
    // return globalMetrics;
  } catch (error) {
    logError("Error uploading JSON file with timestamp", error);
    throw error; // Rethrow to handle this error in the calling code
  }
}

export async function getData(key: string, url: string): Promise<any> {
  if (!useS3) {
    const filePath = `./data/${key}.json`;

    try {
      console.log("in here getting data from json file");
      const marketData = await readJsonFromFile(filePath);
      const stats = fs.statSync(filePath);
      const now = new Date();
      const lastModified = new Date(stats.mtime);
      const minutesDiff =
        (now.getTime() - lastModified.getTime()) / (1000 * 60);

      if (minutesDiff < 1) {
        console.log("the time stamp has not been completed");
        return marketData;
      } else {
        console.log("Cache is stale, need to revalidate.");
      }
    } catch (e) {
      logError(
        "Error getting global data from local storage, fetching from API",
        e
      );
    }

    // Fetch from the API if the local data is stale or not present
    try {
      console.log("grabbing updated data cache is stale");
      const globalMetrics = await fetchData(url);

      await uploadJsonFileWithTimestamp(globalMetrics, key);
      return globalMetrics;
    } catch (error) {
      logError(
        "Failed to fetch new data from the API, returning stale data if available",
        error
      );
      return readJsonFromFile(filePath).catch(() => ({})); // Return an empty object if all else fails
    }
  } else {
    try {
      const jsonData = await getJsonFile(key);
      return jsonData;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error processing file:", error);
        const errorType =
          (error as AWSError)?.statusCode ??
          (error as Error)?.message ??
          "Unknown error";
        console.log(errorType);
        if (errorType === 404) {
          const globalMetrics = await fetchData(url);
          await uploadS3File(globalMetrics, key);
          return globalMetrics;
        }
      }
    }
  }

  return {};
}
