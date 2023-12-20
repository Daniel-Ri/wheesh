import { render } from '@utils/testHelper';
import Gate from '@pages/Gate';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  stations: [
    {
      id: 1,
      name: 'Halim',
    },
    {
      id: 2,
      name: 'Karawang',
    },
    {
      id: 3,
      name: 'Padalarang',
    },
    {
      id: 4,
      name: 'Tegalluar',
    },
  ],
  validateResult: {
    id: 1727,
    orderId: 11,
    seatId: 2457,
    price: 600000,
    gender: 'Male',
    dateOfBirth: '1995-11-11T17:00:00.000Z',
    idCard: '1234567890123456',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    Order: {
      id: 11,
      userId: 2,
      scheduleId: 65,
      isNotified: true,
      Schedule: {
        id: 65,
        trainId: 5,
        departureStationId: 1,
        arrivalStationId: 3,
        departureTime: '2023-12-17T01:45:00.000Z',
        arrivalTime: '2023-12-17T02:15:00.000Z',
        departureStation: {
          id: 1,
          name: 'Halim',
        },
        arrivalStation: {
          id: 3,
          name: 'Padalarang',
        },
      },
    },
  },
};

beforeEach(() => {
  wrapper = render(<Gate {...mockProps} />);
});

describe('Page Gate', () => {
  test('Renders Gate page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('Gate')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
