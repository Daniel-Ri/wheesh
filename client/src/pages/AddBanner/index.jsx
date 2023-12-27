/* eslint-disable jsx-a11y/label-has-associated-control */
import BackBtn from '@components/BackBtn';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import toast from 'react-hot-toast';
import { Button } from '@mui/material';
import { createBanner } from './actions';

import classes from './style.module.scss';

const AddBanner = ({ intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imageDesktop, setImageDesktop] = useState(null);
  const [imageMobile, setImageMobile] = useState(null);

  const handleImageDesktopChange = (e) => {
    const file = e.target.files[0];
    setImageDesktop(file);
  };

  const handleImageMobileChange = (e) => {
    const file = e.target.files[0];
    setImageMobile(file);
  };

  const handleSuccess = () => {
    toast.success(formatMessage({ id: 'app_success_add_banner' }));
    navigate('/banner');
  };

  const handleError = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleSubmit = () => {
    if (!imageDesktop || !imageMobile) {
      toast.error(formatMessage({ id: 'app_need_to_upload_images' }));
      return;
    }

    const formData = new FormData();
    formData.append('imageDesktop', imageDesktop);
    formData.append('imageMobile', imageMobile);

    dispatch(createBanner(formData, handleSuccess, handleError));
  };

  return (
    <main data-testid="AddBanner" className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/banner')} />
          <h1>
            <FormattedMessage id="app_add_banner" />
          </h1>
        </header>

        <div className={classes.form}>
          <div className={classes.input}>
            <label htmlFor="imageDesktop">
              <FormattedMessage id="app_desktop_image" />:
            </label>
            <input type="file" id="imageDesktop" accept="image/*" onChange={handleImageDesktopChange} />

            <div className={classes.preview}>
              <p>
                <FormattedMessage id="app_preview" />:
              </p>
              <div className={classes.imageDesktop}>
                {imageDesktop ? (
                  <img src={URL.createObjectURL(imageDesktop)} alt="Desktop Preview" />
                ) : (
                  <div className={classes.message}>
                    <FormattedMessage id="app_havent_choose_the_image" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={classes.input}>
            <label htmlFor="imageMobile">
              <FormattedMessage id="app_mobile_image" />:
            </label>
            <input type="file" id="imageMobile" accept="image/*" onChange={handleImageMobileChange} />

            <div className={classes.preview}>
              <p>
                <FormattedMessage id="app_preview" />:
              </p>
              <div className={classes.imageMobile}>
                {imageMobile ? (
                  <img src={URL.createObjectURL(imageMobile)} alt="Mobile Preview" />
                ) : (
                  <div className={classes.message}>
                    <FormattedMessage id="app_havent_choose_the_image" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={classes.button}>
          <Button data-testid="Submit" variant="contained" onClick={handleSubmit}>
            <FormattedMessage id="app_submit" />
          </Button>
        </div>
      </div>
    </main>
  );
};

AddBanner.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(AddBanner);
