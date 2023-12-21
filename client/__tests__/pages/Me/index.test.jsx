import { render } from '@utils/testHelper';
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
});
