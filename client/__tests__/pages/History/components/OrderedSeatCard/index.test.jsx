import { render } from '@utils/testHelper';
import OrderedSeatCard from '@pages/History/components/OrderedSeatCard';

let wrapper;

const mockProps = {
  orderedSeat: {
    id: 1721,
    orderId: 9,
    seatId: 361,
    price: 200000,
    gender: 'Male',
    dateOfBirth: '1951-08-23T01:28:44.000Z',
    idCard: '1217434274792992',
    name: 'John Ganteng',
    email: '1buyf4bn@example.com',
    Seat: {
      id: 361,
      carriageId: 5,
      seatNumber: '11D',
      seatClass: 'economy',
      Carriage: {
        id: 5,
        trainId: 1,
        carriageNumber: 5,
      },
    },
  },
  addLine: true,
};

beforeEach(() => {
  wrapper = render(<OrderedSeatCard {...mockProps} />);
});

describe('Component OrderedSeatCard of History page', () => {
  test('Renders OrderedSeatCard component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('OrderedSeatCard')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
