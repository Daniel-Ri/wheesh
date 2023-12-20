import { render, fireEvent } from '@utils/testHelper';
import PassengerCard from '@pages/Book/components/PassengerCard';

const mockHandleClick = jest.fn();
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
  onClick: mockHandleClick,
};

beforeEach(() => {
  wrapper = render(<PassengerCard {...mockProps} />);
});

describe('Component PassengerCard of Book Page', () => {
  test('Renders PassengerCard component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('PassengerCard')).toBeInTheDocument();
  });

  test('Calls onClick when button is clicked', () => {
    const { getByTestId } = wrapper;

    const deleteBtn = getByTestId('DeleteIconButton');
    fireEvent.click(deleteBtn);

    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
