import { render, fireEvent } from '@utils/testHelper';
import BackBtn from '@components/BackBtn';

const mockHandleClickBack = jest.fn();
let wrapper;

beforeEach(() => {
  wrapper = render(<BackBtn handleClickBack={mockHandleClickBack} />);
});

describe('Component BackBtn', () => {
  test('Renders BackBtn component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('BackBtn')).toBeInTheDocument();
  });

  test('Calls handleClickBack when button is clicked', () => {
    const { getByTestId } = wrapper;

    const backBtn = getByTestId('BackBtn');
    fireEvent.click(backBtn);

    expect(mockHandleClickBack).toHaveBeenCalledTimes(1);
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
