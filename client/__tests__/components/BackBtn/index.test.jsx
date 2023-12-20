import { render } from '@utils/testHelper';
import BackBtn from '@components/BackBtn';

const mockHandleClickBack = jest.fn();
let wrapper;

beforeEach(() => {
  wrapper = render(<BackBtn handleClickBack={mockHandleClickBack} />);
});

describe('Component BackBtn', () => {
  test('renders BackBtn component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('BackBtn')).toBeInTheDocument();
  });
});
