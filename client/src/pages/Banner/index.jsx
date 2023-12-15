import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
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

import classes from './style.module.scss';
import { selectBanners } from './selectors';
import BannerRow from './components/BannerRow';

const Banner = ({ user, banners }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    dispatch(getBanners());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Not Authorized');
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/me')} />
          <h1>Banner Management</h1>
        </header>

        <div className={classes.button}>
          <Button variant="contained" className={classes.btn} onClick={() => navigate('/addBanner')}>
            <AddOutlinedIcon className={classes.icon} />
            <div className={classes.message}>Add</div>
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
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  banners: selectBanners,
});

export default connect(mapStateToProps)(Banner);
