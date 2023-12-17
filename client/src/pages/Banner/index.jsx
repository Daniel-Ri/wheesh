import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { useMediaQuery } from 'react-responsive';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import BackBtn from '@components/BackBtn';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectUser } from '@containers/Client/selectors';
import toast from 'react-hot-toast';
import { Button } from '@mui/material';
import { getBanners } from './actions';
import { selectBanners } from './selectors';
import BannerRow from './components/BannerRow';

import classes from './style.module.scss';

const Banner = ({ user, banners, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    dispatch(getBanners());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error(formatMessage({ id: 'app_not_authorized' }));
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/me')} />
          <h1>
            <FormattedMessage id="app_banner_management" />
          </h1>
        </header>

        <div className={classes.button}>
          <Button variant="contained" className={classes.btn} onClick={() => navigate('/addBanner')}>
            <AddOutlinedIcon className={classes.icon} />
            <div className={classes.message}>
              <FormattedMessage id="app_add" />
            </div>
          </Button>
        </div>

        <table className={classes.banners}>
          {!isMobile ? (
            <tbody>
              <tr>
                <th>Desktop</th>
                <th>Mobile</th>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <th />
              </tr>
              {banners.map((banner) => (
                <BannerRow key={banner.id} banner={banner} />
              ))}
            </tbody>
          ) : (
            <tbody>
              {banners.map((banner) => (
                <BannerRow key={banner.id} banner={banner} />
              ))}
            </tbody>
          )}
        </table>
      </div>
    </main>
  );
};

Banner.propTypes = {
  user: PropTypes.object,
  banners: PropTypes.array,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  banners: selectBanners,
});

export default injectIntl(connect(mapStateToProps)(Banner));
