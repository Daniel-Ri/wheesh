import { useDispatch } from 'react-redux';
import classes from './style.module.scss';

const MyTickets = () => {
  const dispatch = useDispatch();

  return (
    <main className={classes.main}>
      My Tickets page
    </main>
  );
};

export default MyTickets;
