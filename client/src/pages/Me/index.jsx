import { useDispatch } from 'react-redux';

import classes from './style.module.scss';

const Me = () => {
  const dispatch = useDispatch();

  return (
    <main className={classes.main}>
      Me page
    </main>
  );
};

export default Me;
