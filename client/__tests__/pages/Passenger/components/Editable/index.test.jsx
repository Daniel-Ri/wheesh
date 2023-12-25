import { render } from '@utils/testHelper';
import Editable from '@pages/Passenger/components/Editable';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  passenger: {
    id: 2,
    userId: 1,
    isUser: false,
    gender: 'Female',
    dateOfBirth: '1997-01-31T17:00:00.000Z',
    idCard: '1234567890123496',
    name: 'Jean Doe',
    email: 'jeandoe@gmail.com',
  },
};

beforeEach(() => {
  wrapper = render(<Editable {...mockProps} />);
});

describe('Component Editable of Passenger page', () => {
  test('Renders Editable component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('Editable')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
