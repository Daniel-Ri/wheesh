import { render, fireEvent } from '@utils/testHelper';
import Unpaid from '@pages/Unpaid';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({
    orderId: 1,
  }),
}));

let wrapper;

const mockProps = {
  order: {
    id: 1,
    userId: 1,
    scheduleId: 91,
    isNotified: false,
    createdAt: '2023-12-14T02:58:48.000Z',
    Payment: {
      id: 1,
      orderId: 1,
      amount: 72000000,
      isPaid: false,
      duePayment: '2023-12-14T02:58:49.000Z',
    },
    Schedule: {
      id: 91,
      trainId: 1,
      departureStationId: 1,
      arrivalStationId: 3,
      departureTime: '2023-12-14T23:15:00.000Z',
      arrivalTime: '2023-12-14T23:45:00.000Z',
      departureStation: {
        id: 1,
        name: 'Halim',
      },
      arrivalStation: {
        id: 3,
        name: 'Padalarang',
      },
      Train: {
        id: 1,
        name: 'G1201',
      },
    },
    OrderedSeats: [
      {
        id: 1,
        orderId: 1,
        seatId: 1,
        price: 600000,
        gender: 'Female',
        dateOfBirth: '2001-07-08T06:10:48.000Z',
        idCard: '0264465324275725',
        name: 'Charlie Doe',
        email: null,
        Seat: {
          id: 1,
          carriageId: 1,
          seatNumber: '1A',
          seatClass: 'first',
          Carriage: {
            id: 1,
            trainId: 1,
            carriageNumber: 1,
          },
        },
      },
      {
        id: 2,
        orderId: 1,
        seatId: 2,
        price: 600000,
        gender: 'Male',
        dateOfBirth: '1977-04-13T04:00:29.000Z',
        idCard: '7032177580189973',
        name: 'Nur Williams',
        email: null,
        Seat: {
          id: 2,
          carriageId: 1,
          seatNumber: '1C',
          seatClass: 'first',
          Carriage: {
            id: 1,
            trainId: 1,
            carriageNumber: 1,
          },
        },
      },
    ],
  },
  locale: 'id',
};

beforeEach(() => {
  wrapper = render(<Unpaid {...mockProps} />);
});

describe('Page Unpaid', () => {
  test('Renders Unpaid page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('Unpaid')).toBeInTheDocument();
  });

  test('Should call navigate when BackBtn clicked', () => {
    const { getByTestId } = wrapper;
    const backButton = getByTestId('BackBtn');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/my-tickets');
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
