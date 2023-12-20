import { render, fireEvent } from '@utils/testHelper';
import ChangeBanner from '@pages/ChangeBanner';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({
    bannerId: 1,
  }),
}));

let wrapper;

const mockProps = {
  user: {
    id: 1,
    role: 'admin',
  },
};

beforeEach(() => {
  wrapper = render(<ChangeBanner {...mockProps} />);
});

describe('Page ChangeBanner', () => {
  test('Renders ChangeBanner page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('ChangeBanner')).toBeInTheDocument();
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
