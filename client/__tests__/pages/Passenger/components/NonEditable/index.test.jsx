import { render } from '@utils/testHelper';
import NonEditable from '@pages/Passenger/components/NonEditable';

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
  wrapper = render(<NonEditable {...mockProps} />);
});

describe('Component NonEditable of Passenger page', () => {
  test('Renders NonEditable component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('NonEditable')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
