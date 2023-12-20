import { render } from '@utils/testHelper';
import History from '@pages/History';

const mockNavigate = jest.fn();

// jest.mock('react-redux', () => ({
//   useDispatch: jest.fn(),
// }));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({
    orderId: 9,
  }),
}));

let wrapper;

const mockProps = {
  order: {
    id: 9,
    userId: 2,
    scheduleId: 1,
    isNotified: true,
    createdAt: '2023-12-20T06:02:10.000Z',
    Payment: {
      id: 9,
      orderId: 9,
      amount: 600000,
      isPaid: true,
      duePayment: '2023-12-20T06:02:11.000Z',
    },
    Schedule: {
      id: 1,
      trainId: 1,
      departureStationId: 1,
      arrivalStationId: 3,
      departureTime: new Date(new Date().getTime() - 8 * 60 * 60 * 1000),
      arrivalTime: new Date(new Date().getTime() - 7 * 60 * 60 * 1000),
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
      {
        id: 1722,
        orderId: 9,
        seatId: 169,
        price: 200000,
        gender: 'Male',
        dateOfBirth: '1996-05-31T07:27:29.000Z',
        idCard: '1332443674346541',
        name: 'Bob Johnson',
        email: null,
        Seat: {
          id: 169,
          carriageId: 3,
          seatNumber: '9B',
          seatClass: 'economy',
          Carriage: {
            id: 3,
            trainId: 1,
            carriageNumber: 3,
          },
        },
      },
      {
        id: 1723,
        orderId: 9,
        seatId: 451,
        price: 200000,
        gender: 'Male',
        dateOfBirth: '1985-06-15T03:40:42.000Z',
        idCard: '4930380435545503',
        name: 'Alice Smith',
        email: 'thvw0o17@example.com',
        Seat: {
          id: 451,
          carriageId: 6,
          seatNumber: '11D',
          seatClass: 'economy',
          Carriage: {
            id: 6,
            trainId: 1,
            carriageNumber: 6,
          },
        },
      },
    ],
  },
  locale: 'id',
};

beforeEach(() => {
  wrapper = render(<History {...mockProps} />);
});

describe('Page History', () => {
  // test('Renders History page', () => {
  //   const { getByTestId } = wrapper;
  //   expect(getByTestId('History')).toBeInTheDocument();
  // });

  // test('Should match snapshot', () => {
  //   expect(wrapper).toMatchSnapshot();
  // });
  test('test', () => {});
});
