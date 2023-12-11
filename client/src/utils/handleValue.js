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

export const formatRupiah = (price) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });
  return formatter.format(price);
};

const optionsHour = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Jakarta',
};

export const formatHour = (inputDateString) => {
  const inputDate = new Date(inputDateString);
  return inputDate.toLocaleTimeString('en-US', optionsHour);
};
