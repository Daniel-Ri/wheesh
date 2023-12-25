import { render } from '@utils/testHelper';
import OrderedSeatCard from '@pages/Unpaid/components/OrderedSeatCard';

let wrapper;

const mockProps = {
  orderedSeat: {
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
  addLine: true,
};

beforeEach(() => {
  wrapper = render(<OrderedSeatCard {...mockProps} />);
});

describe('Component OrderedSeatCard of Order page', () => {
  test('Renders OrderedSeatCard component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('OrderedSeatCard')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
