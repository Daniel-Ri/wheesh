import { render, fireEvent } from '@utils/testHelper';
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
  isOneLeft: false,
};

beforeEach(() => {
  wrapper = render(<BannerRow {...mockProps} />);
});

describe('Component BannerRow of Banner page', () => {
  test('Renders BannerRow component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('BannerRowDesktop')).toBeInTheDocument();
  });

  test('Should navigate to change banner page when change button is clicked', () => {
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('ChangeBannerButton'));
    expect(mockNavigate).toHaveBeenCalledWith(`/changeBanner/${mockProps.banner.id}`);
  });

  test('Should render dialog when delete banner button is clicked', () => {
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('DeleteBannerButton'));
    expect(getByTestId('Dialog')).toBeInTheDocument();
  });

  test('Can click confirm delete button after render dialog', () => {
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('DeleteBannerButton'));
    fireEvent.click(getByTestId('Confirm'));
  });

  test('Can click close dialog after click cancel on dialog', () => {
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('DeleteBannerButton'));
    fireEvent.click(getByTestId('Cancel'));
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
