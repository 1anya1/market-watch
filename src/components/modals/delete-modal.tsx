import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  ModalFooter,
  HStack,
  Button,
} from "@chakra-ui/react";


const DeleteModal = (props: any) => {
  const { isOpen, onClose, delteteFunction, text } = props;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody pt="40px !important">
            <Text variant="body">{text}</Text>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button variant="medium-hollow" onClick={delteteFunction}>
                Delete
              </Button>
              <Button variant="medium" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default DeleteModal;
