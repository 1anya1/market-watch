import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Navigation from "../../src/components/navigation";
const Chart = dynamic(() => import("../../src/components/chart"), {
  ssr: false,
});

const CryptoCoinItem = () => {
  const router = useRouter();
  const coinId = router.query.idx;

  return (
    <>
      <Navigation />
      <Chart coinId={coinId} individualPage={true} />
    </>
  );
};

export default CryptoCoinItem;
