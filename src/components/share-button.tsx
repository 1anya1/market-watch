import { Button, HStack, Text, useToast } from "@chakra-ui/react";
import { FaShareAlt } from "react-icons/fa";
import { TbClipboardCheck } from "react-icons/tb";

const ShareButton = () => {
  const toast = useToast();
  return (
    <Button variant="medium-hollow">
      <FaShareAlt
        size={18}
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast({
            // title: "Copied to clipboard",
            // // status: "info",
            // variant: "solid",
            isClosable: true,
            position: "top",
            duration: 1000,
            render: () => (
              <HStack
                justifyContent="center"
                bg="green"
                width="max-content"
                margin="20px auto 0 auto"
                p=" 10px 20px"
                borderRadius="6px"
              >
                <TbClipboardCheck size={18} />
                <Text variant="toast" color="white">
                  Copied to Clipboard!
                </Text>
              </HStack>
            ),
          });
        }}
      />
    </Button>
  );
};
export default ShareButton;
