import PropTypes from 'prop-types';
import bannerImage1Desktop from '@static/images/Frame 1 - Desktop.png';
import bannerImage2Desktop from '@static/images/Frame 2 - Desktop.png';
import bannerImage1Mobile from '@static/images/Frame 1 - Mobile.png';
import bannerImage2Mobile from '@static/images/Frame 2 - Mobile.png';

import { Paper } from '@mui/material';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import classes from './style.module.scss';

const ImageCarousel = () => {
  const dekstopItems = [
    {
      img: bannerImage1Desktop,
      // You can add additional properties like caption, alt text, etc.
    },
    {
      img: bannerImage2Desktop,
    },
    // Add more items as needed
  ];

  const mobileItems = [
    {
      img: bannerImage1Mobile,
    },
    {
      img: bannerImage2Mobile,
    },
  ];

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

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
        ? dekstopItems.map((item, index) => (
            <SwiperSlide key={index} className={classes.swiperSlide}>
              <img src={item.img} alt={item.alt} />{' '}
            </SwiperSlide>
          ))
        : mobileItems.map((item, index) => (
            <SwiperSlide key={index} className={classes.swiperSlide}>
              <img src={item.img} alt={item.alt} />
            </SwiperSlide>
          ))}
    </Swiper>
  );
};

export default ImageCarousel;

const Item = ({ item }) => (
  <Paper>
    <img src={item.img} alt={item.alt} style={{ width: '100%' }} />
  </Paper>
);

Item.propTypes = {
  item: PropTypes.object.isRequired,
};
