import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';
import { LightMode, NightsStay } from '@mui/icons-material';
import { setTheme } from '@containers/App/actions';

import classes from './style.module.scss';

const ThemeToggle = ({ theme }) => {
  const dispatch = useDispatch();

  const handleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={classes.theme} onClick={handleTheme} data-testid="theme-toggle">
      {theme === 'light' ? <NightsStay /> : <LightMode />}
    </div>
  );
};

ThemeToggle.propTypes = {
  theme: PropTypes.string,
};

export default ThemeToggle;
