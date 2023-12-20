import { render } from '@utils/testHelper';
import Banner from '@pages/Banner';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  connect: jest.fn((mapStateToProps) => (Component) => (props) => <Component {...props} {...mapStateToProps} />),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

let wrapper;

const mockProps = {
  user: {
    id: 1,
    role: 'admin',
  },
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
  wrapper = render(<Banner user={mockProps.user} banners={mockProps.banners} />);
});

describe('Pages Banner', () => {
  test('Renders Banner page', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('Banner')).toBeInTheDocument();
  });
});

// // pages/Banner/index.test.jsx
// import { Provider } from 'react-redux';
// import { IntlProvider } from 'react-intl';
// import { render, screen, fireEvent } from '@utils/testHelper'; // Assuming your test helper is in the specified location
// import Banner from '@pages/Banner';
// import store from '../../../src/configureStore'; // Provide the correct path to your configureStore

// // Mock the react-redux module
// jest.mock('react-redux', () => ({
//   ...jest.requireActual('react-redux'), // Use the actual implementation for most functions
//   connect: jest.fn(() => (Component) => Component),
// }));

// // Mock the react-router-dom module
// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockNavigate,
// }));

// const mockBanners = [
//   // Provide mock data for your banners
// ];

// describe('Banner Page', () => {
//   test('Renders Banner page', () => {
//     render(
//       <Provider store={store}>
//         <IntlProvider locale="en" messages={{}}>
//           <Banner user={{ role: 'admin' }} banners={mockBanners} intl={{ formatMessage: jest.fn() }} />
//         </IntlProvider>
//       </Provider>
//     );

//     // Check if the component renders without errors
//     expect(screen.getByTestId('Banner')).toBeInTheDocument();

//     // Add more assertions based on your component's structure and behavior
//   });

//   test('handles button click and navigates to /addBanner', () => {
//     render(
//       <Provider store={store}>
//         <IntlProvider locale="en" messages={{}}>
//           <Banner user={{ role: 'admin' }} banners={mockBanners} intl={{ formatMessage: jest.fn() }} />
//         </IntlProvider>
//       </Provider>
//     );

//     // Find the button and simulate a click event
//     fireEvent.click(screen.getByText('app_add'));

//     // Check if the navigate function is called with the correct argument
//     expect(mockNavigate).toHaveBeenCalledWith('/addBanner');
//   });

//   // Add more tests as needed for different scenarios and edge cases
// });
