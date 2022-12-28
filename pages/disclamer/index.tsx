import { Text, Box } from "@chakra-ui/react";

const Disclamer = () => {
  return (
    <>
      <Text variant="h-2" pb="40px">
        Disclaimer
      </Text>
      <Box pb="40px">
        <Text variant="h-3">No Investment Advice</Text>
        <Text>
          {`The information provided on this website does not constitute
          investment advice, financial advice, trading advice, or any other
          advice. You should not treat any of the website's content as such.
          Crypto-xchange.netlify.app does not recommend that any cryptocurrency
          should be bought, sold, or held by you. Do your due diligence and
          consult your financial advisor before making investment decisions.`}
        </Text>
      </Box>

      <Box pb="40px">
        <Text variant="h-3">Accuracy of Information</Text>
        <Text>{` Crypto-xchange.netlify.app will strive to ensure the accuracy of the information listed on this website, although it will not hold any responsibility for any missing or wrong information.  Crypto-xchange.netlify.app provides all information as is. You understand that you are using any and all information available here at your own risk.`}</Text>
      </Box>
      <Box pb="40px">
        <Text variant="h-3">Non Endorsement</Text>
        <Text>{`The appearance of third-party advertisements and hyperlinks on  Crypto-xchange.netlify.app does not constitute an endorsement, guarantee, warranty, or recommendation by  Crypto-xchange.netlify.app. Do conduct your due diligence before deciding to use any third-party services.`}</Text>
      </Box>
    </>
  );
};

export default Disclamer;
