import { Text } from "@chakra-ui/react";
const Header = (props: any) => {
  const { title } = props;
  return <Text variant="h-3">{title}</Text>;
};

export default Header;
