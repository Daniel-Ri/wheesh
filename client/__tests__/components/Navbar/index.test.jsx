import { render, fireEvent } from '@utils/testHelper';
import Navbar from '@components/Navbar';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => '/',
}));

let wrapper;
beforeEach(() => {
  wrapper = render(<Navbar title="Title" locale="id" theme="light" />);
});

describe('Component Navbar', () => {
  test('Correct render', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('navbar')).toBeInTheDocument();
  });

  test('Should call navigate when HomeLink clicked', () => {
    const { getByTestId } = wrapper;
    const homeNav = getByTestId('HomeLink');
    fireEvent.click(homeNav);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('Should call navigate when MyTicketsLink clicked', () => {
    const { getByTestId } = wrapper;
    const myTicketsNav = getByTestId('MyTicketsLink');
    fireEvent.click(myTicketsNav);
    expect(mockNavigate).toHaveBeenCalledWith('/my-tickets');
  });

  test('Should call navigate when MeLink clicked', () => {
    const { getByTestId } = wrapper;
    const meNav = getByTestId('MeLink');
    fireEvent.click(meNav);
    expect(mockNavigate).toHaveBeenCalledWith('/me');
  });

  test('Should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
