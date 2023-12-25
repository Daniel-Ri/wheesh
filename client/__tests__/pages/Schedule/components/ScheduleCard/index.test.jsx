import { render, fireEvent } from '@utils/testHelper';
import ScheduleCard from '@pages/Schedule/components/ScheduleCard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  login: false,
  schedule: {
    id: 66,
    Train: {
      id: 6,
      name: 'G1206',
    },
    departureStation: {
      id: 1,
      name: 'Halim',
    },
    arrivalStation: {
      id: 3,
      name: 'Padalarang',
    },
    departureTime: '2023-12-15T02:45:00.000Z',
    arrivalTime: '2023-12-15T03:15:00.000Z',
    firstSeatAvailable: 'Available',
    businessSeatAvailable: 'Available',
    economySeatAvailable: 'Available',
    prices: [
      {
        id: 196,
        scheduleId: 66,
        seatClass: 'economy',
        price: 200000,
      },
      {
        id: 197,
        scheduleId: 66,
        seatClass: 'business',
        price: 450000,
      },
      {
        id: 198,
        scheduleId: 66,
        seatClass: 'first',
        price: 600000,
      },
    ],
  },
};

beforeEach(() => {
  wrapper = render(<ScheduleCard {...mockProps} />);
});

describe('Component ScheduleCard of Schedule page', () => {
  test('Renders ScheduleCard component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('ScheduleCard')).toBeInTheDocument();
  });

  test("Should navigate when click 'Book' button", () => {
    const { getByTestId } = wrapper;
    const bookEconomySeatButton = getByTestId('BookEconomySeatButton');
    fireEvent.click(bookEconomySeatButton);
    expect(mockNavigate).toHaveBeenCalledWith(`/book/${mockProps.schedule.id}/economy`);
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
