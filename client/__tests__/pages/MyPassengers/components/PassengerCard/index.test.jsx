import { render } from '@utils/testHelper';
import PassengerCard from '@pages/MyPassengers/components/PassengerCard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
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
  wrapper = render(<PassengerCard {...mockProps} />);
});

describe('Component PassengerCard of MyPassengers page', () => {
  test('Renders PassengerCard component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('PassengerCard')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
