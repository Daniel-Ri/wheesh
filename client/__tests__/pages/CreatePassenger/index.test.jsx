import { render, fireEvent } from '@utils/testHelper';
import CreatePassenger from '@pages/CreatePassenger';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<CreatePassenger />);
});

describe('Page CreatePassenger', () => {
  test('Renders CreatePassenger page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('CreatePassenger')).toBeInTheDocument();
  });

  test('Should call navigate when BackBtn clicked', () => {
    const { getByTestId } = wrapper;
    const backButton = getByTestId('BackBtn');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/myPassengers');
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
