import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { createStructuredSelector } from 'reselect';
import { selectUser } from '@containers/Client/selectors';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import KeyIcon from '@mui/icons-material/Key';
import MailIcon from '@mui/icons-material/Mail';

import { Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '@containers/Client/actions';
import toast from 'react-hot-toast';

import classes from './style.module.scss';

const Me = ({ user, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clickHeader = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const clickPassengerPage = () => {
    if (!user) {
      toast.error(formatMessage({ id: 'app_need_to_login' }));
    } else {
      navigate('/myPassengers');
    }
  };

  const clickChangePasswordPage = () => {
    if (!user) {
      toast.error(formatMessage({ id: 'app_need_to_login' }));
    } else {
      navigate('/changePassword');
    }
  };

  const clickChangeEmailPage = () => {
    if (!user) {
      toast.error(formatMessage({ id: 'app_need_to_login' }));
    } else {
      navigate('/changeEmail');
    }
  };

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header className={classes.header} onClick={clickHeader}>
          <Avatar className={classes.icon} />
          <h1>{user && user.username ? user.username : 'Login'}</h1>
        </header>

        <section>
          <h2>
            <FormattedMessage id="app_account_information" />
          </h2>
          <hr />
          <div className={classes.sectionDesc}>
            <div className={classes.links}>
              <div className={classes.link} onClick={clickPassengerPage}>
                <RecentActorsOutlinedIcon className={classes.icon} />
                <div className={classes.namePage}>
                  <FormattedMessage id="app_passenger_list" />
                </div>
              </div>
              <div className={classes.link} onClick={clickChangePasswordPage}>
                <KeyIcon className={classes.icon} />
                <div className={classes.namePage}>Password</div>
              </div>
              <div className={classes.link} onClick={clickChangeEmailPage}>
                <MailIcon className={classes.icon} />
                <div className={classes.namePage}>E-mail</div>
              </div>
            </div>
          </div>
        </section>

        {user && user.role === 'admin' && (
          <section>
            <h2>
              <FormattedMessage id="app_website_management" />
            </h2>
            <hr />
            <div className={classes.sectionDesc}>
              <div className={classes.links}>
                <div className={classes.link} onClick={() => navigate('/banner')}>
                  <PhotoSizeSelectActualOutlinedIcon className={classes.icon} />
                  <div className={classes.namePage}>Banner</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {user && (
          <section>
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          </section>
        )}
      </div>
    </main>
  );
};

Me.propTypes = {
  user: PropTypes.object,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default injectIntl(connect(mapStateToProps)(Me));
