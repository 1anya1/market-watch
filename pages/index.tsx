import Head from "next/head";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import DataTable from "../src/components/table";
import NewsFeed from "../src/components/news-feed";
import Navigation from "../src/components/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import { BsFillTriangleFill } from "react-icons/bs";

import "swiper/css";
import "swiper/css/pagination";

// type FormData = {
//   name: string;
//   email: string;
//   password: string;
// };

// const SignUp = (props: any) => {
//   const { userActive, setUserActive, setUserInfo } = props;
//   const {
//     register,
//     setValue,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();
//   const onSubmit = handleSubmit(async (data) => {
//     const { name, email, password } = data;
//     const databaseVerification = async () => {
//       const docRef = doc(database, "users", name);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         console.log("the user already exists");
//       } else {
//         console.log("No such document!");

//         const auth = getAuth();
//         try {
//           const { user } = await createUserWithEmailAndPassword(
//             auth,
//             email,
//             password
//           );
//           await updateProfile(user, { displayName: name });
//           await setDoc(doc(database, "users", name), {
//             username: name,
//             email: email,
//             // uid,
//           });
//         } finally {
//           await signInWithEmailAndPassword(auth, email, password)
//             .then(async (userCredential) => {
//               console.log(userCredential);
//               const user = userCredential.user;
//               console.log("successfully signed in");
//               setUserActive(true);
//               setUserInfo({ username: name });
//               localStorage.setItem("username", JSON.stringify(name));
//             })
//             .catch((error) => {
//               const errorCode = error.code;
//               const errorMessage = error.message;
//               console.log(errorCode, errorMessage);
//             });
//         }
//       }
//     };
//     databaseVerification();
//   });

//   return (
//     <form onSubmit={onSubmit}>
//       <VStack spacing={0} gap="11px">
//         <VStack spacing={0} gap="4px" width="100%">
//           <FormLabel margin="0">Name</FormLabel>
//           <Input variant="flushed" {...register("name")} />
//         </VStack>
//         <VStack spacing={0} gap="4px" width="100%">
//           <FormLabel margin="0">Email</FormLabel>
//           <Input variant="flushed" {...register("email")} />
//         </VStack>
//         <VStack spacing={0} gap="4px" width="100%">
//           <FormLabel margin="0">Password</FormLabel>
//           <Input variant="flushed" {...register("password")} />
//         </VStack>
//         <Button type="submit">Submit</Button>
//       </VStack>
//     </form>
//   );
// };

// const SignIn = (props: any) => {
//   const { setUserActive, setUserInfo } = props;
//   const {
//     register,
//     setValue,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();

//   const onSubmit = handleSubmit((data) => {
//     const { email, password } = data;
//     const auth = getAuth();

//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in
//         const user: any = userCredential.user;
//         console.log({ user });
//         setUserActive(true);
//         // setUserInfo({ username: name, uid: userCredential.user.uid });
//         localStorage.setItem("username", JSON.stringify(user.displayName));
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorCode, errorMessage);
//       });
//   });

//   return (
//     <form onSubmit={onSubmit}>
//       <VStack spacing={0} gap="11px">
//         {/* <VStack spacing={0} gap="4px" width="100%">
//           <FormLabel margin="0">Name</FormLabel>
//           <Input {...register("name")} />
//         </VStack> */}
//         <VStack spacing={0} gap="4px" width="100%">
//           <FormLabel margin="0">Email</FormLabel>
//           <Input {...register("email")} />
//         </VStack>
//         <VStack spacing={0} gap="4px" width="100%">
//           <FormLabel margin="0">Password</FormLabel>
//           <Input {...register("password")} />
//         </VStack>
//         <Button type="submit">Submit</Button>
//       </VStack>
//     </form>
//   );
// };

// const SignOut = (props: any) => {
//   const [userIn, setUsername] = useState<null | string>(null);
//   useEffect(() => {
//     const username = localStorage.getItem("username");
//     if (username) {
//       setUsername(username);
//     }
//   }, []);
//   console.log("here");
//   const { userActive, setUserActive, setUserInfo } = props;

//   const sOut = () => {
//     const auth = getAuth();

//     signOut(auth)
//       .then(() => {
//         console.log("success");
//         // Sign-out successful.
//         setUserActive(false);
//         setUserInfo({ username: "", uid: "" });
//         localStorage.removeItem("username");
//         localStorage.removeItem("loggedIn");
//         localStorage.removeToken("token");
//       })
//       .catch((error) => {
//         // An error happened.
//         console.log("cant sign out ????");
//       });
//   };
//   return userActive || userIn ? <Button onClick={sOut}>Sign Out</Button> : null;
// };

const Home = () => {
  const [data, setData] = useState<any[]>([]);
  const [width, setWidth] = useState(0);
  const [slides, setSlides] = useState(1.25);
  const { colorMode } = useColorMode();
  const [userActive, setUserActive] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", uid: "" });

  useEffect(() => {
    console.log({ userActive }, { userInfo });
  }, [userActive, userInfo]);
  useEffect(() => {
    const username = localStorage.getItem("username");
    // const loggedIn = localStorage.getItem("loggedIn");
    if (username) {
      setUserActive(true);
      // setActive("true" === loggedIn);
    }
  }, [userActive]);
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h"
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  useEffect(() => console.log(data, width), [data, width]);
  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    if (width >= 2100) {
      setSlides(5);
    } else if (width >= 1600) {
      setSlides(4);
    } else if (width >= 1100) {
      setSlides(3);
    } else if (width >= 800) {
      setSlides(2.25);
    } else if (width >= 300) {
      setSlides(1.18);
    } else {
      setSlides(1);
    }
  }, [width]);

  return (
    <>
      {data.length > 0 && (
        <Box pt="40px">
          <Swiper
            slidesPerView={slides}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
          >
            {data.map((el) => (
              <SwiperSlide key={el.name}>
                <Stack
                  backgroundColor={
                    colorMode === "light" ? "#f5f6fa" : "#133364"
                  }
                  p="10px 21px"
                  borderRadius="11px"
                >
                  <HStack>
                    <Box
                      background={`url(${el.image})`}
                      h="30px"
                      w="30px"
                      backgroundSize="contain"
                    />
                    <Text fontSize="16px" fontWeight="500">
                      {el.name}
                    </Text>
                    <Text fontSize="16px" fontWeight="700">
                      {el.symbol.toUpperCase()}
                    </Text>
                  </HStack>
                  <HStack gap="10px">
                    <Text
                      fontSize={{ base: "20px", md: "24px" }}
                      fontWeight="500"
                    >
                      ${el.current_price}
                    </Text>
                    <HStack>
                      <Box
                        transform={
                          el.price_change_percentage_24h < 0
                            ? "rotate(180deg)"
                            : "rotate(0deg)"
                        }
                      >
                        {el.price_change_percentage_24h !== 0 && (
                          <BsFillTriangleFill
                            size={8}
                            fill={
                              el.price_change_percentage_24h < 0
                                ? "var(--red)"
                                : "var(--green)"
                            }
                          />
                        )}
                      </Box>
                      <Text
                        color={
                          el.price_change_percentage_24h < 0 ? "red" : "green"
                        }
                      >
                        {Math.abs(el.price_change_percentage_24h).toFixed(2)}%
                      </Text>
                    </HStack>
                  </HStack>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}

      <Box>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* <Chart coinId="bitcoin" /> */}
        <DataTable />
        <NewsFeed />
      </Box>
    </>
  );
};

export default Home;
