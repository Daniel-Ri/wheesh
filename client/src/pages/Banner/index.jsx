import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMediaQuery } from 'react-responsive';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import BackBtn from '@components/BackBtn';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Button } from '@mui/material';
import { getBanners } from './actions';
import { selectBanners } from './selectors';
import BannerRow from './components/BannerRow';

import classes from './style.module.scss';

const Banner = ({ banners }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    dispatch(getBanners());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main data-testid="Banner" className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/me')} />
          <h1>
            <FormattedMessage id="app_banner_management" />
          </h1>
        </header>

        <div className={classes.button}>
          <Button
            data-testid="AddBannerButton"
            variant="contained"
            className={classes.btn}
            onClick={() => navigate('/addBanner')}
          >
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
                <BannerRow key={banner.id} banner={banner} isOneLeft={banners.length === 1} />
              ))}
            </tbody>
          ) : (
            <tbody>
              {banners.map((banner) => (
                <BannerRow key={banner.id} banner={banner} isOneLeft={banners.length === 1} />
              ))}
            </tbody>
          )}
        </table>
      </div>
    </main>
  );
};

Banner.propTypes = {
  banners: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  banners: selectBanners,
});

export default connect(mapStateToProps)(Banner);
