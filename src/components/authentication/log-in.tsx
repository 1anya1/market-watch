import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "../../../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useEffect, useState } from "react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignIn = (props: any) => {
  const { onClose } = props;
  const [errorMessage, setError] = useState<null | string>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { logIn, user } = useAuth();
  const onSubmit = handleSubmit(async (data) => {
    try {
     const res = await logIn(data.email, data.password);
      console.log(res)
      if (res) {
        onClose()
      }
    } catch (error: any) {
      const val = error.message;
      console.log(val);
      if (val.indexOf("password") || val.indexOd("email")) {
        setError("The email and/or password you entered do not match.");
      }
    } 
  });
  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(!show);
  };



  return (
    <form onSubmit={onSubmit} style={{ zIndex: "100" }}>
      <VStack spacing={0} gap="20px" pt="28px" zIndex="100">
        {errorMessage && (
          <Box>
            <Text color="red">{errorMessage}</Text>
          </Box>
        )}
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
          // onClick={onClose}
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
