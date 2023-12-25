import { render } from '@utils/testHelper';
import Passenger from '@pages/Passenger';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({
    passengerId: 1,
  }),
}));

let wrapper;

const mockProps = {
  passenger: {
    id: 1,
    userId: 1,
    isUser: true,
    gender: 'Male',
    dateOfBirth: '1995-11-11T17:00:00.000Z',
    idCard: '1234567890123456',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
  },
};

beforeEach(() => {
  wrapper = render(<Passenger {...mockProps} />);
});

describe('Page Passenger', () => {
  test('Renders Passenger page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('Passenger')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
