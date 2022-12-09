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

export async function marketMovers() {
  fetch(
    "https://price-api.crypto.com/price/v1/top-movers?depth=10"
  )
    .then(async (resMovers) => {
      console.log(await resMovers.text())
      const movers = await resMovers.json();
      console.log(movers)

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
