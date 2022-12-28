import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "../../../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignIn = (props: any) => {
  const { onClose } = props;
  const {
    register,

    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { logIn } = useAuth();
  const onSubmit = handleSubmit(async (data) => {
    try {
      await logIn(data.email, data.password);
    } catch (error: any) {
      console.log(error.message);
    }
  });
  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(!show);
  };

  return (
    <form onSubmit={onSubmit} style={{ zIndex: "100" }}>
      <VStack spacing={0} gap="20px" pt="40px" zIndex="100">
        <VStack spacing={0} gap="4px" width="100%" alignItems="flex-start">
          <FormLabel margin="0">Email Address</FormLabel>
          <Input {...register("email")} />
        </VStack>
        <VStack spacing={0} gap="4px" width="100%" alignItems="flex-start">
          <FormLabel margin="0">Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              {...register("password")}
            />
            <InputRightElement width="4.5rem">
              {show ? (
                <AiOutlineEyeInvisible size={18} onClick={handleClick} />
              ) : (
                <AiOutlineEye size={18} onClick={handleClick} />
              )}
            </InputRightElement>
          </InputGroup>
        </VStack>
        <Button
          type="submit"
          onClick={onClose}
          width="100%"
          variant="large-blue"
        >
          Sign In
        </Button>
      </VStack>
    </form>
  );
};

export default SignIn;
