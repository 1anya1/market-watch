import { Box, HStack, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiLinkExternal } from "react-icons/bi";

// TODO need to move the data call to index and pass as prop. Revalidate hourly ??? and save to local host

const NewsFeed = () => {
  const [data, setData] = useState<any[]>([]);
  const date = new Date();
  const twentyFourHours = new Date(
    new Date(date).getTime() + 60 * 60 * 24 * 1000
  );
  const [newsData, setNewsData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${window.location.origin}/api/newsfeed`)
      .then((data) => {
        return data.json();
      })
      .then((news) => {
        if (news.result.status === "ok") {
          const withImages = news.result.articles.filter(
            (el: { urlToImage: null }) => {
              return el.urlToImage;
            }
          );
          setNewsData(withImages);
        }
      });
  }, []);

  const dateParser = (val: string) => {
    const fullDate = val.split("T");
    return new Date(fullDate[0]).toLocaleString("en-us", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  if (newsData.length > 0) {
    return (
      <>
        <Text fontSize="32px" fontWeight="700" pb="20px" pt='40px'>
          Crypto News
        </Text>
        <HStack flexWrap="wrap" gap="60px">
          {newsData.map((el, idx) => (
            <Stack
              flexDir={{ base: "column", lg: "row" }}
              gap="20px"
              key={`${el.link}=${idx}`}
              margin="0 !important"
              justifyContent="space-between"
              w="100%"
            >
              <Box
                backgroundImage={`url("${el.urlToImage}")`}
                backgroundSize="cover"
                h={{ base: "260px", lg: "240px" }}
                w={{ base: "100%", lg: "475px" }}
                margin="0 !important"
                borderRadius="11px"
              />
              <VStack
                width={{ base: "100%", lg: "calc(100% - 475px - 60px)" }}
                justifyContent="center"
                alignItems="flex-start"
              >
                <Link href={el.url} isExternal>
                  <Text fontSize="24px" lineHeight="1.5" fontWeight="700">
                    {el.title.replace(/[^a-zA-Z ]/g, "")}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "8px",
                        lineHeight: "1.5",
                      }}
                    >
                      <BiLinkExternal size={24} />
                    </span>
                  </Text>
                  <Text fontWeight="bold">{dateParser(el.publishedAt)}</Text>
                </Link>
                <Text lineHeight="1.5" fontSize="18px" maxW="100%">
                  {el.description.replace(/(<([^>]+)>)/gi, "")}
                </Text>
              </VStack>
            </Stack>
          ))}
        </HStack>
      </>
    );
  }
  return null;
};
export default NewsFeed;
