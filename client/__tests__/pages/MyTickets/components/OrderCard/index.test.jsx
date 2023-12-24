import { render } from '@utils/testHelper';
import OrderCard from '@pages/MyTickets/components/OrderCard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  order: {
    id: 11,
    userId: 1,
    scheduleId: 92,
    isNotified: false,
    createdAt: '2023-12-14T02:59:20.000Z',
    Payment: {
      id: 11,
      orderId: 11,
      amount: 900000,
      isPaid: false,
      duePayment: '2023-12-14T03:59:20.000Z',
    },
    Schedule: {
      id: 92,
      trainId: 2,
      departureStationId: 1,
      arrivalStationId: 3,
      departureTime: '2023-12-14T23:40:00.000Z',
      arrivalTime: '2023-12-15T00:10:00.000Z',
      departureStation: {
        id: 1,
        name: 'Halim',
      },
      arrivalStation: {
        id: 3,
        name: 'Padalarang',
      },
      Train: {
        id: 2,
        name: 'G1202',
      },
    },
    OrderedSeats: [
      {
        name: 'John Doe',
      },
      {
        name: 'Jean Doe',
      },
    ],
  },
};

beforeEach(() => {
  wrapper = render(<OrderCard {...mockProps} />);
});

describe('Component OrderCard of My Tickets page', () => {
  test('Renders OrderCard component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('OrderCard')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
