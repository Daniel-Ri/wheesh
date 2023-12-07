import MainLayout from '@layouts/MainLayout';
import CreatePassenger from '@pages/CreatePassenger';

import Home from '@pages/Home';
import Login from '@pages/Login';
import Me from '@pages/Me';
import MyPassengers from '@pages/MyPassengers';
import MyTickets from '@pages/MyTickets';
import NotFound from '@pages/NotFound';
import Passenger from '@pages/Passenger';
import Register from '@pages/Register';

const routes = [
  {
    path: '/',
    name: 'Home',
    protected: false,
    component: Home,
    layout: MainLayout,
  },
  {
    path: '/my-tickets',
    name: 'My Tickets',
    protected: false,
    component: MyTickets,
    layout: MainLayout,
  },
  {
    path: '/me',
    name: 'Me',
    protected: false,
    component: Me,
    layout: MainLayout,
  },
  {
    path: '/login',
    name: 'Login',
    protected: false,
    component: Login,
    layout: MainLayout,
  },
  {
    path: '/register',
    name: 'Register',
    protected: false,
    component: Register,
    layout: MainLayout,
  },
  {
    path: '/myPassengers',
    name: 'My Passengers',
    protected: true,
    component: MyPassengers,
    layout: MainLayout,
  },
  {
    path: '/createPassenger',
    name: 'Create Passenger',
    protected: true,
    component: CreatePassenger,
    layout: MainLayout,
  },
  {
    path: '/passenger/:passengerId',
    name: 'Passenger',
    protected: true,
    component: Passenger,
    layout: MainLayout,
  },
  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false },
];

export default routes;
