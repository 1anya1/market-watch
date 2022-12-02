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
  const { setUserActive, onClose } = props;
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { logIn } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    // const { email, password } = data;

    // const router = useRouter();
    try {
      await logIn(data.email, data.password);
      // router.push("/dashboard");
    } catch (error: any) {
      console.log(error.message);
    }

    // signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     // Signed in
    //     const user: any = userCredential.user;
    //     // setUserInfo({ username: name, uid: userCredential.user.uid });
    //     localStorage.setItem("username", JSON.stringify(user.displayName));
    //     setUserActive(true);
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.log(errorCode, errorMessage);
    //   });
  });

  return (
    <form onSubmit={onSubmit}>
      <VStack spacing={0} gap="20px" pt="40px">
        {/* <VStack spacing={0} gap="4px" width="100%">
            <FormLabel margin="0">Name</FormLabel>
            <Input {...register("name")} />
          </VStack> */}
        <VStack spacing={0} gap="4px" width="100%" alignItems="flex-start">
          <FormLabel margin="0">Email Address</FormLabel>
          <Input {...register("email")} />
        </VStack>
        <VStack spacing={0} gap="4px" width="100%" alignItems="flex-start">
          <FormLabel margin="0">Password</FormLabel>
          <Input {...register("password")} />
        </VStack>
        <Button type="submit" onClick={onClose} width="100%" variant="blue">
          Sign In
        </Button>
      </VStack>
    </form>
  );
};

export default SignIn;
