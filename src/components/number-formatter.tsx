import { Box } from "@chakra-ui/react";
import { NumericFormat } from "react-number-format";

const FormattedNumber = (props: any) => {
  const { value, prefix, sufffix } = props;

  console.log(value)
  let num = Number(value) >= 1 ? Number(value).toFixed(2) : Number(value).toFixed(6);

  return (
    <NumericFormat
      value={num}
      prefix={prefix}
      suffix={sufffix}
      displayType="text"
      thousandSeparator=","
      style={{
        fontSize: "inherit",
        fontWeight: "inherit",
      }}
    />
  );
};

export default FormattedNumber;
