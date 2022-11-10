import { getJsonFile, uploadJsonFile } from "./s3";

const fs = require("fs");

export async function updateCards() {
  const getData = await getJsonFile("news", "feed");
  if (await getData) {
    return getData;
  } else {
    const data = await fetch(
      `https://newsapi.org/v2/everything?q=crypto&from=2022-11-08&sortBy=popularity&apiKey=${process.env.NEWS_KEY}&language=en`
    )
      .then((response) => response.json())
      .then((data) => data);
    if ((await data.status) === "ok") {
      uploadJsonFile(await data, "news", "feed");
      return true;
    }
  }
  return false;
}
