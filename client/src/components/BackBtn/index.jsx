import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import classes from './style.module.scss';

const BackBtn = () => {
  const navigate = useNavigate();

  return (
    <Button className={classes.btn} onClick={() => navigate(-1)}>
      Back
    </Button>
  );
};

export default BackBtn;
