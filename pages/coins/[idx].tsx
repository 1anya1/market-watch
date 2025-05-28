import IndividualCoin from "../../src/components/individual-coin";

interface data {
  cryptoId: string;
  articles: string[];
  videos: string[];
}

const CryptoCoinItem = ({ cryptoId, articles, videos }: data) => {
  return (
    <IndividualCoin
      coinId={cryptoId}
      individualPage={true}
      articles={articles}
      videos={videos}
    />
  );
};

export default CryptoCoinItem;

export async function getStaticProps(context: { params: { idx: any } }) {
  const cryptoId = context.params.idx;
  let articles = [];
  let videos = [];
  let id = null;

  try {
    // Step 1: Get all tokens to find the correct ID by symbol
    const tokensResponse = await fetch(
      `https://price-api.crypto.com/meta/v1/all-tokens`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; CryptoXchangeBot/1.0)",
          Accept: "application/json",
        },
      }
    );
    const tokensData = await tokensResponse.json();
    console.log(tokensData);

    const cryptoToken = tokensData.data.find(
      (coin: { name: string }) =>
        coin.name.toLowerCase().replace(/\s+/g, "-") ===
        cryptoId.toLowerCase().replace(/\s+/g, "-")
    );

    id = cryptoToken?.id;

    // Step 2: Fetch news if we found a valid cryptoId
    if (cryptoId) {
      const newsResponse = await fetch(
        `https://price-api.crypto.com/market/v1/token/${id}/news`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; CryptoXchangeBot/1.0)",
            Accept: "application/json",
          },
        }
      );

      if (newsResponse.ok) {
        const newsData = await newsResponse.json();

        videos = newsData.videos ?? [];
        articles = newsData.articles ?? [];
      }
    }
  } catch (error) {
    console.warn("Failed to fetch token or news data:", error);
  }

  return {
    props: {
      cryptoId,
      articles,
      videos,
    },
    revalidate: 3600, // Rebuild every hour
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
