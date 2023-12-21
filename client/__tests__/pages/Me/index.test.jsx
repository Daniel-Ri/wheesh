import { render, fireEvent } from '@utils/testHelper';
import Me from '@pages/Me';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Me Page', () => {
  test('Renders Me page with user not login', () => {
    const wrapper = render(<Me />);
    const { getByTestId, queryByTestId } = wrapper;
    expect(getByTestId('Me')).toBeInTheDocument();
    expect(getByTestId('MyPassengersLink')).toBeInTheDocument();
    expect(getByTestId('ChangePasswordLink')).toBeInTheDocument();
    expect(getByTestId('ChangeEmailLink')).toBeInTheDocument();
    expect(queryByTestId('WebManagement')).toBeNull();
  });

  test('Redirect to Login when not login', () => {
    const wrapper = render(<Me />);
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('Header'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('Cannot Redirect to MyPassengers when not login', () => {
    const wrapper = render(<Me />);
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('MyPassengersLink'));
    expect(mockNavigate).not.toHaveBeenCalledWith('/myPassengers');
  });

  test('Cannot Redirect to ChangePassword when not login', () => {
    const wrapper = render(<Me />);
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('ChangePasswordLink'));
    expect(mockNavigate).not.toHaveBeenCalledWith('/changePassword');
  });

  test('Cannot Redirect to ChangeEmail when not login', () => {
    const wrapper = render(<Me />);
    const { getByTestId } = wrapper;
    fireEvent.click(getByTestId('ChangeEmailLink'));
    expect(mockNavigate).not.toHaveBeenCalledWith('/changeEmail');
  });

  test('Should match snapshot', () => {
    const wrapper = render(<Me />);
    expect(wrapper).toMatchSnapshot();
  });
});
