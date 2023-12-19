const crypto = require('crypto');

const getRandomDOB = () => {
  let startDateLimit = new Date();
  startDateLimit.setFullYear(startDateLimit.getFullYear() - 100);

  let endDateLimit = new Date();
  endDateLimit.setFullYear(endDateLimit.getFullYear() - 17);

  // Generate a random date within the range
  let randomDOB = new Date(
    startDateLimit.getTime() + Math.random() * (endDateLimit.getTime() - startDateLimit.getTime())
  );

  return randomDOB;
}

const generateRandomId = () => {
  let randomId = '';
  for (let i = 0; i < 16; i++) {
    randomId += Math.floor(Math.random() * 10);
  }
  return randomId;
}

const firstNames = ["John", "Jane", "Alice", "Bob", "Charlie", "Agus", "Asep", "Slamet", "Dewi", "Nur"];
const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Ganteng", "Cantik"];

const generateRandomName = () => {
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${randomFirstName} ${randomLastName}`;
}

const generateRandomEmail = () => {
  // List of possible characters for the random part of the email address
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  // Length of the random part of the email address
  const randomPartLength = 8;
  
  // Generate a random string
  const randomPart = Array.from({ length: randomPartLength }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
  
  // Predefined domain
  const domain = 'example.com';
  
  // Construct the email address
  const email = `${randomPart}@${domain}`;
  
  return email;
}

exports.generateOrderedSeatItem = (orderedSeatId, orderId, seatId, price) => {
  return {
    id: orderedSeatId,
    orderId,
    seatId,
    price,
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    dateOfBirth: getRandomDOB(),
    idCard: generateRandomId(),
    name: generateRandomName(),
    email: Math.random() > 0.5 ? generateRandomEmail() : null,
    secret: crypto.randomBytes(32).toString('hex'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

exports.select80PercentRandomly = (inputArray) => {
  // Calculate the number of elements to select (80%)
  const selectionSize = Math.ceil(0.8 * inputArray.length);

  // Clone the array to avoid modifying the original array
  const shuffledArray = shuffleArray([...inputArray]);

  // Slice the array to get the first 80% of the shuffled array
  const selectedArray = shuffledArray.slice(0, selectionSize);

  return selectedArray;
}

exports.selectRandomly = (inputArray, selectionSize) => {
  // Clone the array to avoid modifying the original array
  const shuffledArray = shuffleArray([...inputArray]);

  // Slice the array to get the first 80% of the shuffled array
  const selectedArray = shuffledArray.slice(0, selectionSize);

  return selectedArray;
}

exports.formatDateWithDay = (date) => {
  const inputDate = new Date(date);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = days[inputDate.getDay()];

  const day = inputDate.getDate();
  const month = inputDate.toLocaleString('en-US', { month: 'short' });
  const year = inputDate.getFullYear();

  const formattedDate = `${dayOfWeek}, ${day} ${month} ${year}`;
  return formattedDate;
};

const optionsHour = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Jakarta',
};

exports.formatHour = (inputDateString) => {
  const inputDate = new Date(inputDateString);
  return inputDate.toLocaleTimeString('en-US', optionsHour);
};