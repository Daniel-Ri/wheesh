import { render, fireEvent } from '@utils/testHelper';
import Register from '@pages/Register';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  login: false,
};

beforeEach(() => {
  wrapper = render(<Register {...mockProps} />);
});

describe('Page Register', () => {
  test('Renders Register page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('Register')).toBeInTheDocument();
  });

  test('Should call navigate when BackBtn clicked', () => {
    const { getByTestId } = wrapper;
    const backButton = getByTestId('BackBtn');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
