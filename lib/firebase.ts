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


// const buyPortfolio = async (cointQuantity: number) => {
//   if (user.name) {
//     const data = {
//       date: new Date().getTime(),
//       price: coinInfo.currentPrice.usd,
//       quantity: Number(cointQuantity),
//       totalValue: Number(coinInfo.currentPrice.usd) * Number(cointQuantity),
//     };
//     const existingData = await getDoc(
//       doc(
//         database,
//         "users",
//         user.name,
//         "portfolio",
//         coinInfo.name.toLowerCase()
//       )
//     );
//     const incomingData: any = existingData.data();
//     let updatedData: any = {};
//     if (incomingData) {
//       const { buy, sell, holdings, holdingsValue, totalProceeds } =
//         incomingData;
//       console.log(holdingsValue, data.totalValue);
//       updatedData = {
//         buy: buy ? [...buy, data] : [data],
//         sell: sell ? [...sell] : [],
//         holdingsValue: holdingsValue
//           ? Number(holdingsValue) + Number(data.totalValue)
//           : Number(data.totalValue),
//         holdings: holdings
//           ? Number(holdings) + Number(data.quantity)
//           : Number(data.quantity),
//         totalProceeds: totalProceeds ? totalProceeds : 0,
//       };
//     } else {
//       updatedData = {
//         buy: [data],
//         sell: [],
//         holdings: Number(data.quantity),
//         holdingdValue: Number(data.totalValue),
//         totalProceeds: 0,
//       };
//     }
//     await setDoc(
//       doc(
//         database,
//         "users",
//         user.name,
//         "portfolio",
//         coinInfo.name.toLowerCase()
//       ),
//       updatedData
//     );
//   }
// };
// const sellPortfolio = async (cointQuantity: number) => {
//   if (user.name) {
//     const data = {
//       date: new Date().getTime(),
//       price: coinInfo.currentPrice.usd,
//       quantity: Number(cointQuantity),
//       totalValue: Number(coinInfo.currentPrice.usd) * Number(cointQuantity),
//     };
//     const existingData = await getDoc(
//       doc(
//         database,
//         "users",
//         user.name,
//         "portfolio",
//         coinInfo.name.toLowerCase()
//       )
//     );
//     const incomingData: any = existingData.data();
//     let updatedData: any = {};
//     if (incomingData) {
//       const { buy, sell, holdings, holdingsValue, totalProceeds } =
//         incomingData;
//       console.log(holdingsValue, data.totalValue);
//       updatedData = {
//         buy: buy ? [...buy] : [],
//         sell: sell ? [...sell, data] : [data],
//         holdingsValue: holdingsValue
//           ? Number(holdingsValue) - Number(data.totalValue)
//           : Number(-data.totalValue),
//         holdings: holdings
//           ? Number(holdings) - Number(data.quantity)
//           : Number(-data.quantity),
//         totalProceeds: totalProceeds
//           ? totalProceeds + data.totalValue
//           : data.totalValue,
//       };
//     } else {
//       updatedData = {
//         buy: [],
//         sell: [data],
//         holdings: Number(-data.quantity),
//         holdingsValue: Number(-data.totalValue),
//         totalProceeds: data.totalValue,
//       };
//     }
//     await setDoc(
//       doc(
//         database,
//         "users",
//         user.name,
//         "portfolio",
//         coinInfo.name.toLowerCase()
//       ),
//       updatedData
//     );
//   }
// };