import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  Firestore,
  deleteDoc,
} from "firebase/firestore";
import { database } from "../context/clientApp";

export async function liked(username: any): Promise<any> {
  const arr: string[] = [];
  if (username && username.length > 0) {
    const docRef = collection(database, "users", username, "liked");
    const docSnap = await getDocs(docRef);
    if (docSnap.docs.length > 0) {
      docSnap.forEach((doc) => {
        arr.push(doc.id);
      });
      return arr;
    }
  }
  return null;
}
