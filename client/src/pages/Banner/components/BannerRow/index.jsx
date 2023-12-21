import { Button, Dialog } from '@mui/material';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { useNavigate } from 'react-router-dom';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import config from '@config/index';
import { useMediaQuery } from 'react-responsive';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { deleteBanner } from '@pages/Banner/actions';
import classes from './style.module.scss';

const BannerRow = ({ banner, intl: { formatMessage } }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccessDelete = () => {
    toast.success(formatMessage({ id: 'app_success_delete_banner' }));
  };

  const handleErrorDelete = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleDeleteBanner = () => {
    dispatch(deleteBanner(banner.id, handleSuccessDelete, handleErrorDelete));
  };

  return (
    <>
      {!isMobile ? (
        <tr data-testid="BannerRowDesktop">
          <td>
            <div className={classes.image}>
              <img src={`${config.api.host}${banner.imageDesktop}`} alt="" />
            </div>
          </td>
          <td>
            <div className={classes.image}>
              <img src={`${config.api.host}${banner.imageMobile}`} alt="" />
            </div>
          </td>
          <td className={classes.buttons}>
            <Button
              data-testid="ChangeBannerButton"
              variant="contained"
              className={classes.btn}
              onClick={() => navigate(`/changeBanner/${banner.id}`)}
            >
              <ModeEditOutlinedIcon />
            </Button>
            <Button
              data-testid="DeleteBannerButton"
              variant="contained"
              className={`${classes.btn} ${classes.delete}`}
              onClick={() => setOpen(true)}
            >
              <DeleteOutlineOutlinedIcon />
            </Button>
          </td>
        </tr>
      ) : (
        <>
          <tr data-testid="BannerRowMobile">
            <th>Desktop</th>
            <td>
              <div className={classes.image}>
                <img src={`${config.api.host}${banner.imageDesktop}`} alt="" />
              </div>
            </td>
            <td className={classes.editCell}>
              <Button
                variant="contained"
                className={classes.btn}
                onClick={() => navigate(`/changeBanner/${banner.id}`)}
              >
                <ModeEditOutlinedIcon />
              </Button>
            </td>
          </tr>
          <tr>
            <th>Mobile</th>
            <td>
              <div className={classes.imageMobile}>
                <img src={`${config.api.host}${banner.imageMobile}`} alt="" />
              </div>
            </td>
            <td className={classes.deleteCell}>
              <Button variant="contained" className={`${classes.btn} ${classes.delete}`} onClick={() => setOpen(true)}>
                <DeleteOutlineOutlinedIcon />
              </Button>
            </td>
          </tr>
        </>
      )}
      <Dialog data-testid="Dialog" open={open} onClose={handleClose}>
        <div className={classes.dialog}>
          <div className={classes.content}>
            <h2>
              <FormattedMessage id="app_verification" />
            </h2>
            <div className={classes.message}>
              <FormattedMessage id="app_sure_deleting_the_banner" />
            </div>
          </div>
          <div className={classes.buttons}>
            <Button data-testid="Cancel" variant="outlined" className={classes.cancel} onClick={handleClose}>
              <FormattedMessage id="app_cancel" />
            </Button>
            <Button data-testid="Confirm" variant="contained" className={classes.confirm} onClick={handleDeleteBanner}>
              <FormattedMessage id="app_confirm" />
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

BannerRow.propTypes = {
  banner: PropTypes.object.isRequired,
  intl: PropTypes.object,
};

export default injectIntl(BannerRow);
