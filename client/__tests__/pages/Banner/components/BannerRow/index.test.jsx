import { render } from '@utils/testHelper';
import BannerRow from '@pages/Banner/components/BannerRow';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

let wrapper;

const mockProps = {
  banner: {
    id: 1,
    imageDesktop: 'public/Frame 1 - Desktop.png',
    imageMobile: 'public/Frame 1 - Mobile.png',
  },
};

beforeEach(() => {
  wrapper = render(<BannerRow banner={mockProps.banner} />);
});

describe('Component BannerRow of Banner component', () => {
  test('Renders BannerRow component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('BannerRowDesktop')).toBeInTheDocument();
  });
});
