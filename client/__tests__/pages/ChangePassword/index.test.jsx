import { render, fireEvent } from '@utils/testHelper';
import ChangePassword from '@pages/ChangePassword';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<ChangePassword />);
});

describe('Page ChangePassword', () => {
  test('Renders ChangePassword page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('ChangePassword')).toBeInTheDocument();
  });

  test('Should call navigate when BackBtn clicked', () => {
    const { getByTestId } = wrapper;
    const backButton = getByTestId('BackBtn');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/me');
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
