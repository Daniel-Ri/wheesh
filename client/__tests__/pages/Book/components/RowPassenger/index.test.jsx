import { render, fireEvent } from '@utils/testHelper';
import RowPassenger from '@pages/Book/components/RowPassenger';
import classes from '@pages/Book/components/RowPassenger/style.module.scss';

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
  chosenSeat: {
    carriageNumber: 1,
    seatNumber: '4A',
    seatId: 13,
  },
  isActive: true,
  onClick: mockHandleClick,
};

beforeEach(() => {
  wrapper = render(<RowPassenger {...mockProps} />);
});

describe('Component RowPassenger of Book Page', () => {
  test('Renders RowPassenger component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('RowPassenger')).toBeInTheDocument();
  });

  test('Show active color when isActive is true', () => {
    const { getByTestId } = wrapper;
    const rowPassengerComponent = getByTestId('RowPassenger');
    expect(rowPassengerComponent).toHaveClass(classes.activeRow);
  });

  test('Calls onClick when RowPassenger is clicked', () => {
    const { getByTestId } = wrapper;
    const rowPassengerComponent = getByTestId('RowPassenger');
    fireEvent.click(rowPassengerComponent);

    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
