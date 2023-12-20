import { render, fireEvent } from '@utils/testHelper';
import OptionCard from '@pages/Book/components/OptionCard';

const mockHandleClick = jest.fn();
let wrapper;

const mockProps = {
  seatClass: 'first',
  price: 'Rp 600.000',
  available: 'Available',
  isSelected: false,
  onClick: mockHandleClick,
};

beforeEach(() => {
  wrapper = render(<OptionCard {...mockProps} />);
});

describe('Component OptionCard of Book Page', () => {
  test('Renders OptionCard component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('OptionCard')).toBeInTheDocument();
  });

  test('Calls onClick when button is clicked', () => {
    const { getByTestId } = wrapper;

    const card = getByTestId('OptionCard');
    fireEvent.click(card);

    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
