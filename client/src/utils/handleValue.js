export const censorIdCard = (idCard) => {
  const formattedValue = `${idCard.slice(0, 4)}****${idCard.slice(-2)}`;
  return formattedValue;
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
