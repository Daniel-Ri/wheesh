import { render, fireEvent } from '@utils/testHelper';
import Profile from '@pages/Profile';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  profile: {
    id: 1,
    username: 'bangjoe',
    role: 'admin',
    email: 'bangjoe@gmail.com',
    Passengers: [
      {
        id: 1,
        userId: 1,
        isUser: true,
        gender: 'Male',
        dateOfBirth: '1995-10-13T17:00:00.000Z',
        idCard: '1243567890123456',
        name: 'Bang Joe',
        email: 'bangjoe@gmail.com',
      },
    ],
  },
};

beforeEach(() => {
  wrapper = render(<Profile {...mockProps} />);
});

describe('Page Profile', () => {
  test('Renders Profile page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('Profile')).toBeInTheDocument();
  });

  test('Should call navigate when BackBtn clicked', () => {
    const { getByTestId } = wrapper;
    const backButton = getByTestId('BackBtn');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/me');
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
