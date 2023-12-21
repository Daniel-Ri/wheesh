import { render } from '@utils/testHelper';
import Login from '@pages/Login';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  login: false,
};

beforeEach(() => {
  wrapper = render(<Login {...mockProps} />);
});

describe('Page Login', () => {
  test('Renders Login page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('Login')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
