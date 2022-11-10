import { getJsonFile, uploadJsonFile } from "./s3";

const fs = require("fs");

export async function updateCards(key: any) {
  try {
    const getData = await getJsonFile("news", "feed");
    return await getData;
  } catch (e) {
    const data = await fetch(
      `https://newsapi.org/v2/everything?q=crypto&from=2022-11-08&sortBy=popularity&apiKey=${key}&language=en`
    )
      .then((response) => response.json())
      .then((data) => data);

    if ((await data.status) === "ok") {
      uploadJsonFile(await data, "news", "feed");
      return true;
    }
    return false;
  }
}
