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
  const signUp = async (email: string, password: string, name: string) => {
    const docRef = doc(database, "users", name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("the user already exists");
    } else {
      console.log("No such document!");
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
        await logIn(email, password);
      }
    }
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    setUser({ name: null });
    await signOut(auth);
  };
  return (
    <AuthContext.Provider value={{ user, logOut, signUp, logIn }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
