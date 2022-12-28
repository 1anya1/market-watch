const numberFormater = (value: number) => {
  if (value < 1e3) return value;
  if (value > 1e9) return (value / 1e9).toFixed(2) + "B";
  if (value > 1e6) return (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return +(value / 1e3).toFixed(1) + "K";
};

export default numberFormater;
