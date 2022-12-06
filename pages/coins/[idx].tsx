import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
const Chart = dynamic(() => import("../../src/components/chart"), {
  ssr: false,
});

const CryptoCoinItem = () => {
  const router = useRouter();
  const coinId = router.query.idx;

  return <Chart coinId={coinId} individualPage={true} />;
};

export default CryptoCoinItem;
