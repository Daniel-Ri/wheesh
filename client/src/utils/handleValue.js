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

export const formatOrderDate = (dateString) => {
  const inputDate = new Date(dateString);
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(inputDate.getDate()).padStart(2, '0');

  return `${day}/${month}/${year}`;
};

export const formatDateWithDay = (date, locale = 'en') => {
  const inputDate = new Date(date);

  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysId = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const days = locale === 'id' ? daysId : daysEn;

  const dayOfWeek = days[inputDate.getDay()];

  const day = inputDate.getDate();
  const month = inputDate.toLocaleString(locale, { month: 'short' });
  const year = inputDate.getFullYear();

  const formattedDate = `${dayOfWeek}, ${day} ${month} ${year}`;
  return formattedDate;
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

export const convertChosenSeats = (chosenSeats) => {
  const newMap = new Map();
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of chosenSeats) {
    newMap.set(value.seatId, key);
  }

  return newMap;
};
