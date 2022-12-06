import { Button, FormLabel, Input, VStack } from "@chakra-ui/react";
import { database, app } from "../../../context/clientApp";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";

import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignUp = (props: any) => {
  const { signUp } = useAuth();
  const { setUserActive, setUserInfo, onClose } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = handleSubmit(async (data) => {
    const { name, email, password } = data;
    await signUp(email, password, name);
  });

  return (
    <form onSubmit={onSubmit}>
      <VStack spacing={0} gap="20px" pt="40px">
        <VStack spacing={0} gap="4px" width="100%" alignItems="flex-start">
          <FormLabel margin="0">Name</FormLabel>
          <Input {...register("name")} />
        </VStack>
        <VStack spacing={0} gap="4px" width="100%" alignItems="flex-start">
          <FormLabel margin="0">Email</FormLabel>
          <Input {...register("email")} />
        </VStack>
        <VStack spacing={0} gap="4px" width="100%" alignItems="flex-start">
          <FormLabel margin="0">Password</FormLabel>
          <Input {...register("password")} />
        </VStack>
        <Button type="submit" onClick={onClose} width="100%" variant="large">
          Create Account
        </Button>
      </VStack>
    </form>
  );
};

export default SignUp;
