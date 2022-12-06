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
      } finally {
        console.log(auth);
        await signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            console.log(userCredential);
            const user = userCredential.user;
            console.log("successfully signed in");
            setUser({ name: name });
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

  const logIn = (email: string, password: string) => {
    console.log("in here");
    console.log(auth);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    console.log(auth);
    setUser({ name: null });
    await signOut(auth);
  };
  return (
    <AuthContext.Provider value={{ user, logOut, signUp, logIn }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
