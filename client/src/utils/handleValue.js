export const censorIdCard = (idCard) => {
  const formattedValue = `${idCard.slice(0, 4)}****${idCard.slice(-2)}`;
  return formattedValue;
};
