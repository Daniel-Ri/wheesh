import { render, fireEvent } from '@utils/testHelper';
import AddBanner from '@pages/AddBanner';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  user: {
    id: 1,
    role: 'admin',
  },
};

beforeEach(() => {
  wrapper = render(<AddBanner {...mockProps} />);
});

describe('Page AddBanner', () => {
  test('Renders AddBanner page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('AddBanner')).toBeInTheDocument();
  });

  test('Should call navigate when BackBtn clicked', () => {
    const { getByTestId } = wrapper;
    const backButton = getByTestId('BackBtn');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/banner');
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
