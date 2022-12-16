import { Button, useDisclosure } from "@chakra-ui/react";
import BuySellModal from "./modals/buy-sell-modal";

const BuySellButton = (props: any) => {
  const { coinId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button variant="medium-hollow" onClick={onOpen}>
        Buy/Sell
      </Button>

      {isOpen && (
        <BuySellModal name={coinId} onClose={onClose} isOpen={isOpen} />
      )}
    </>
  );
};

export default BuySellButton;
