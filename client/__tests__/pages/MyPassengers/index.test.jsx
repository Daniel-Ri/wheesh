import { render } from '@utils/testHelper';
import MyPassengers from '@pages/MyPassengers';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  myPassengers: [
    {
      id: 1,
      userId: 1,
      isUser: true,
      gender: 'Male',
      dateOfBirth: '1995-11-11T17:00:00.000Z',
      idCard: '1234567890123456',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    },
    {
      id: 2,
      userId: 1,
      isUser: false,
      gender: 'Female',
      dateOfBirth: '1997-01-31T17:00:00.000Z',
      idCard: '1234567890123496',
      name: 'Jean Doe',
      email: 'jeandoe@gmail.com',
    },
  ],
};

beforeEach(() => {
  wrapper = render(<MyPassengers {...mockProps} />);
});

describe('Page MyPassengers', () => {
  test('Renders MyPassengers page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('MyPassengers')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
