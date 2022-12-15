import FormattedNumber from "../number-formatter";

const NumberCell = (props: any) => {
  const { value, prefix, sufffix } = props;
  return (
    <FormattedNumber
      value={value}
      prefix={prefix}
      className="table-cell-bold"
      sufffix={sufffix}
    />
  );
};

export default NumberCell;
