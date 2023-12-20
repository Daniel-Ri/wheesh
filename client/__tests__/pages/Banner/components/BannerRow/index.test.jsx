import { render } from '@utils/testHelper';
import BannerRow from '@pages/Banner/components/BannerRow';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
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
  wrapper = render(<BannerRow {...mockProps} />);
});

describe('Component BannerRow of Banner page', () => {
  test('Renders BannerRow component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('BannerRowDesktop')).toBeInTheDocument();
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
