import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Navigation from "../../src/components/navigation";
import { useEffect, useState } from "react";
const Chart = dynamic(() => import("../../src/components/chart"), {
  ssr: false,
});

const CryptoCoinItem = () => {
  const router = useRouter();
  const coinId = router.query.idx;
  const [userActive, setUserActive] = useState(false);
  useEffect(() => {
    const username = localStorage.getItem("username");
    console.log("here", username);
    // const loggedIn = localStorage.getItem("loggedIn");
    if (username) {
      setUserActive(true);
      // setActive("true" === loggedIn);
    }
  }, []);
  useEffect(() => {
    console.log(userActive);
  }, [userActive]);

  return (
    <>
      <Chart coinId={coinId} individualPage={true} />
    </>
  );
};

export default CryptoCoinItem;
