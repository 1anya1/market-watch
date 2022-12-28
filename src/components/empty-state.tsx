import { Stack, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import emptyImage from "../../src/images/empty-state.png";

type Props = {
    header : string
    action: string
}

const EmptyState = (props: Props) => {
  const { header, action } = props;
  return (
    <Stack alignItems="center" spacing="0">
      <Box>
        <Image src={emptyImage} alt="empty state image" />
      </Box>
      <Text variant="body" pb="14px">
        {/* You do not have any favorite coins yet. */}
        {header}
      </Text>
      <Link href="/" passHref>
        <Text
          variant="h-5"
          cursor="pointer"
          _hover={{ textDecor: "underline" }}
        >
          {/* Add a new coin to get started! */}
          {action}
        </Text>
      </Link>
    </Stack>
  );
};

export default EmptyState;
