import { render, fireEvent } from '@utils/testHelper';
import ChangeEmail from '@pages/ChangeEmail';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<ChangeEmail />);
});

describe('Page ChangeEmail', () => {
  test('Renders ChangeEmail page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('ChangeEmail')).toBeInTheDocument();
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
