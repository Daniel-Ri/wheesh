import PropTypes from 'prop-types';
import config from '@config/index';

import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import classes from './style.module.scss';

const ImageCarousel = ({ banners }) => {
  const desktopImages = banners.map((banner) => banner.imageDesktop);
  const mobileImages = banners.map((banner) => banner.imageMobile);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Setup this for Swiper
  if (banners.length === 0) return;

  return (
    <Swiper
      style={{
        '--swiper-navigation-color': '#fff',
        '--swiper-pagination-color': '#fff',
      }}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      modules={[Pagination, Navigation, Autoplay]}
      loop
      className={classes.mySwapper}
    >
      {!isMobile
        ? desktopImages.map((imageURL, index) => (
            <SwiperSlide key={index} className={classes.swiperSlide}>
              <img src={`${config.api.host}${imageURL}`} alt="" />
            </SwiperSlide>
          ))
        : mobileImages.map((imageURL, index) => (
            <SwiperSlide key={index} className={classes.swiperSlide}>
              <img src={`${config.api.host}${imageURL}`} alt="" />
            </SwiperSlide>
          ))}
    </Swiper>
  );
};

ImageCarousel.propTypes = {
  banners: PropTypes.array,
};

export default ImageCarousel;
