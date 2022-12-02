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
  console.log(useAuth());
  const router = useRouter();
  const { setUserActive, setUserInfo, onClose } = props;
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = handleSubmit(async (data) => {
    // const { name, email, password } = data;
    try {
      await signUp(data.email, data.password, data.name);
      // router.push("/dashboard");
    } catch (error: any) {
      console.log(error.message);
    }
    // const databaseVerification = async () => {
    //   const docRef = doc(database, "users", name);
    //   const docSnap = await getDoc(docRef);
    //   if (docSnap.exists()) {
    //     console.log("the user already exists");
    //   } else {
    //     console.log("No such document!");

    //     const auth = getAuth();
    //     try {
    //       const { user } = await createUserWithEmailAndPassword(
    //         auth,
    //         email,
    //         password
    //       );
    //       await updateProfile(user, { displayName: name });
    //       await setDoc(doc(database, "users", name), {
    //         username: name,
    //         email: email,
    //         // uid,
    //       });
    //     } finally {
    //       await signInWithEmailAndPassword(auth, email, password)
    //         .then(async (userCredential) => {
    //           console.log(userCredential);
    //           const user = userCredential.user;
    //           console.log("successfully signed in");
    //           setUserActive(true);
    //           setUserInfo({ username: name });
    //           localStorage.setItem("username", JSON.stringify(name));
    //         })
    //         .catch((error) => {
    //           const errorCode = error.code;
    //           const errorMessage = error.message;
    //           console.log(errorCode, errorMessage);
    //         });
    //     }
    //   }
    // };
    // databaseVerification();
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
        <Button type="submit" onClick={onClose} width="100%">
          Create Account
        </Button>
      </VStack>
    </form>
  );
};

export default SignUp;
