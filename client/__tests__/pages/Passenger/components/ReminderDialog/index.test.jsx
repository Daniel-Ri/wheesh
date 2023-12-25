import { render, fireEvent } from '@utils/testHelper';
import ReminderDialog from '@pages/Passenger/components/ReminderDialog';

const mockHandleClickClose = jest.fn();
const mockHandleClickDelete = jest.fn();
let wrapper;

const mockProps = {
  open: true,
  handleClose: mockHandleClickClose,
  handleDelete: mockHandleClickDelete,
};

beforeEach(() => {
  wrapper = render(<ReminderDialog {...mockProps} />);
});

describe('Component ReminderDialog of Passenger page', () => {
  test('Renders ReminderDialog component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('ReminderDialog')).toBeInTheDocument();
  });

  test('Calls handleClickClose when button is clicked', () => {
    const { getByTestId } = wrapper;

    const cancelBtn = getByTestId('CancelButton');
    fireEvent.click(cancelBtn);

    expect(mockHandleClickClose).toHaveBeenCalledTimes(1);
  });

  test('Calls handleClickDelete when button is clicked', () => {
    const { getByTestId } = wrapper;

    const confirmBtn = getByTestId('ConfirmButton');
    fireEvent.click(confirmBtn);

    expect(mockHandleClickDelete).toHaveBeenCalledTimes(1);
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
