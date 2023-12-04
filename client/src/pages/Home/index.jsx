import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import classes from './style.module.scss';
import ImageCarousel from './components/ImageCarousel';

const Home = () => {
  const dispatch = useDispatch();

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <ImageCarousel />
        {/* <div className={classes.images}>
          {!isTabletOrMobile ? <img src={bannerImage1Desktop} alt="" /> : <img src={bannerImage1Mobile} alt="" />}
        </div> */}
        <FormattedMessage id="app_greeting" />
      </div>
    </main>
  );
};

export default Home;
