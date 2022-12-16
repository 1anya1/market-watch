import { NumericFormat } from "react-number-format";

const FormattedNumber = (props: any) => {
  const { value, prefix, sufffix, className } = props;

  let num =
    Math.abs(Number(value)) >= 1
      ? Number(value).toFixed(2)
      : Number(value).toFixed(6);

  return (
    <NumericFormat
      className={className}
      value={num}
      prefix={prefix}
      suffix={sufffix}
      displayType="text"
      thousandSeparator=","
    />
  );
};

export default FormattedNumber;
