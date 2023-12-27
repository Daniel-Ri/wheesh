import { render, fireEvent } from '@utils/testHelper';
import Banner from '@pages/Banner';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  banners: [
    {
      id: 1,
      imageDesktop: 'public/Frame 1 - Desktop.png',
      imageMobile: 'public/Frame 1 - Mobile.png',
    },
    {
      id: 2,
      imageDesktop: 'public/Frame 2 - Desktop.png',
      imageMobile: 'public/Frame 2 - Mobile.png',
    },
    {
      id: 3,
      imageDesktop: 'public/Frame 3 - Desktop.png',
      imageMobile: 'public/Frame 3 - Mobile.png',
    },
    {
      id: 4,
      imageDesktop: 'public/Frame 4 - Desktop.png',
      imageMobile: 'public/Frame 4 - Mobile.png',
    },
    {
      id: 5,
      imageDesktop: 'public/Frame 5 - Desktop.png',
      imageMobile: 'public/Frame 5 - Mobile.png',
    },
  ],
};

beforeEach(() => {
  wrapper = render(<Banner {...mockProps} />);
});

describe('Page Banner', () => {
  test('Renders Banner page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('Banner')).toBeInTheDocument();
  });

  test('Should call navigate when BackBtn clicked', () => {
    const { getByTestId } = wrapper;
    const backButton = getByTestId('BackBtn');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/me');
  });

  test('Should call navigate when AddBannerButton clicked', () => {
    const { getByTestId } = wrapper;
    const backButton = getByTestId('AddBannerButton');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/addBanner');
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
