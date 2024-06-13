import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';

import { setLocale } from '@containers/App/actions';

import classes from './style.module.scss';

// eslint-disable-next-line no-unused-vars
const Navbar = ({ title, locale, theme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isSMMaxSize = useMediaQuery({ query: '(max-width: 576px)' });

  const [menuPosition, setMenuPosition] = useState(null);
  const open = Boolean(menuPosition);

  const handleClick = (event) => {
    setMenuPosition(event.currentTarget);
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  const onSelectLang = (lang) => {
    if (lang !== locale) {
      dispatch(setLocale(lang));
    }
    handleClose();
  };

  const goHome = () => {
    navigate('/');
  };

  const goMyTicketsPage = () => {
    navigate('/my-tickets');
  };

  const goGatePage = () => {
    navigate('/gate');
  };

  const goMePage = () => {
    navigate('/me');
  };

  return (
    <div className={classes.headerWrapper} data-testid="navbar">
      <div className={classes.contentWrapper}>
        <div className={classes.logoImage} onClick={goHome}>
          <img src="/train.svg" alt="logo" className={classes.logo} />
          <img src="/wheesh.png" alt="title" className={classes.title} />
        </div>
        <div className={classes.toolbar}>
          <div
            data-testid="HomeLink"
            className={`${classes.link} ${pathname === '/' && classes.linkSelected}`}
            onClick={goHome}
          >
            <HomeIcon className={classes.icon} />
            {!isSMMaxSize && (
              <div className={classes.namePage}>
                <FormattedMessage id="app_home" />
              </div>
            )}
          </div>
          <div
            data-testid="MyTicketsLink"
            className={`${classes.link} ${pathname === '/my-tickets' && classes.linkSelected}`}
            onClick={goMyTicketsPage}
          >
            <ReceiptLongIcon className={classes.icon} />
            {!isSMMaxSize && (
              <div className={classes.namePage}>
                <FormattedMessage id="app_my_tickets" />
              </div>
            )}
          </div>
          <div
            data-testid="GateLink"
            className={`${classes.link} ${pathname === '/gate' && classes.linkSelected}`}
            onClick={goGatePage}
          >
            <DoorSlidingIcon className={classes.icon} />
            {!isSMMaxSize && (
              <div className={classes.namePage}>
                <FormattedMessage id="app_gate" />
              </div>
            )}
          </div>
          <div
            data-testid="MeLink"
            className={`${classes.link} ${pathname === '/me' && classes.linkSelected}`}
            onClick={goMePage}
          >
            <SentimentSatisfiedAltIcon className={classes.icon} />
            {!isSMMaxSize && (
              <div className={classes.namePage}>
                <FormattedMessage id="app_me" />
              </div>
            )}
          </div>
          <div data-testid="ToggleLang" className={classes.toggle} onClick={handleClick}>
            <Avatar className={classes.avatar} src={locale === 'id' ? '/id.png' : '/en.png'} />
            <div className={classes.lang}>{locale}</div>
            {isSMMaxSize ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
        </div>
        <Menu
          data-testid="MenuLang"
          open={open}
          anchorEl={menuPosition}
          onClose={handleClose}
          transformOrigin={
            isSMMaxSize ? { horizontal: 'right', vertical: 'bottom' } : { horizontal: 'left', vertical: 'top' }
          }
          anchorOrigin={
            isSMMaxSize ? { horizontal: 'right', vertical: 'top' } : { horizontal: 'left', vertical: 'bottom' }
          }
        >
          <MenuItem data-testid="IDItem" onClick={() => onSelectLang('id')} selected={locale === 'id'}>
            <div className={classes.menu}>
              <Avatar className={classes.menuAvatar} src="/id.png" />
              <div className={classes.menuLang}>
                <FormattedMessage id="app_lang_id" />
              </div>
            </div>
          </MenuItem>
          <MenuItem data-testid="ENItem" onClick={() => onSelectLang('en')} selected={locale === 'en'}>
            <div className={classes.menu}>
              <Avatar className={classes.menuAvatar} src="/en.png" />
              <div className={classes.menuLang}>
                <FormattedMessage id="app_lang_en" />
              </div>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string,
  locale: PropTypes.string.isRequired,
  theme: PropTypes.string,
};

export default Navbar;
