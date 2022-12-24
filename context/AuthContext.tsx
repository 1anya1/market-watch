import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, database } from "./clientApp";
import { useToast } from "@chakra-ui/react";

interface UserType {
  name: string | null;
}

const AuthContext = createContext({});
export const useAuth = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType>({ name: null });
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    console.log("here on auth change");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
        });
      } else {
        setUser({ name: null });
      }
      setLoading(false);
      return () => unsubscribe();
    });
  }, []);
  const signUp = (email: string, password: string, name: string) => {
    const databaseVerification = async () => {
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(user, { displayName: name });
        await setDoc(doc(database, "users", name), {
          username: name,
          email: email,
          // uid,
        });
        toast({
          title: "Successfully Signed Up",
          description: "Congrats, You have successfully signed up!",
          status: "success",
          variant: "solid",
          duration: 2000,
          position: "top",
          containerStyle: {
            backgroundColor: "green",
            borderRadius: "8px",
          },
        });
      } finally {
        console.log(auth);
        await signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            console.log(userCredential);
            const user = userCredential.user;
            console.log("successfully signed in");
            setUser({ name: name });
            toast({
              title: "Successfully Signed In",
              description: `Welcome Back ${name}`,
              status: "success",
              variant: "solid",
              duration: 2000,
              position: "top",
              containerStyle: {
                backgroundColor: "green",
                borderRadius: "8px",
              },
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      }
    };
    databaseVerification();
  };

  const logIn = async (email: string, password: string) => {
    const validation =  await signInWithEmailAndPassword(auth, email, password);
    console.log({validation})
    if(validation?.user?.displayName){
      toast({
        title: "Successfully Signed In",
        description: `Welcome Back ${validation?.user?.displayName}`,
        status: "success",
        variant: "solid",
        duration: 2000,
        position: "top",
        containerStyle: {
          backgroundColor: "green",
          borderRadius: "8px",
        },
      });

    }
  };

  const logOut = async () => {
    
    setUser({ name: null });
    toast({
      title: "Successfully Signed Out",
      description: `You have successfully signed out`,
      status: "success",
      variant: "solid",
      duration: 2000,
      position: "top",
      containerStyle: {
        backgroundColor: "green",
        borderRadius: "8px",
      },
    });
    await signOut(auth);
  };
  return (
    <AuthContext.Provider value={{ user, logOut, signUp, logIn }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
