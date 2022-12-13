import { Button, FormLabel, Input, VStack } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "../../../context/AuthContext";

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
    console.log(data);
    try {
      await logIn(data.email, data.password);
    } catch (error: any) {
      console.log(error.message);
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ zIndex: "100" }}>
      <VStack spacing={0} gap="20px" pt="40px" zIndex="100">
        <VStack spacing={0} gap="4px" width="100%" alignItems="flex-start">
          <FormLabel margin="0">Email Address</FormLabel>
          <Input {...register("email")} />
        </VStack>
        <VStack spacing={0} gap="4px" width="100%" alignItems="flex-start">
          <FormLabel margin="0">Password</FormLabel>
          <Input {...register("password")} />
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
