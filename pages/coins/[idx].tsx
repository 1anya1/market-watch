import { useRouter } from "next/router";
import IndividualCoin from "../../src/components/individual-coin";

const CryptoCoinItem = () => {
  const router = useRouter();
  const coinId = router.query.idx;

  return <IndividualCoin coinId={coinId} individualPage={true} />;
};

export default CryptoCoinItem;
