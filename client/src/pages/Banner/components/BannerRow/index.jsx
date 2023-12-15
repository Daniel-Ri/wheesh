import { Button, Dialog } from '@mui/material';
import PropTypes from 'prop-types';
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

const BannerRow = ({ banner }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccessDelete = () => {
    toast.success('Success delete banner');
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
        <tr>
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
            <Button variant="contained" className={classes.btn} onClick={() => navigate(`/changeBanner/${banner.id}`)}>
              <ModeEditOutlinedIcon />
            </Button>
            <Button variant="contained" className={`${classes.btn} ${classes.delete}`} onClick={() => setOpen(true)}>
              <DeleteOutlineOutlinedIcon />
            </Button>
          </td>
        </tr>
      ) : (
        <>
          <tr>
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
      <Dialog open={open} onClose={handleClose}>
        <div className={classes.dialog}>
          <div className={classes.content}>
            <h2>Verification</h2>
            <div className={classes.message}>Are you sure about deleting the banner?</div>
          </div>
          <div className={classes.buttons}>
            <Button variant="outlined" className={classes.cancel} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" className={classes.confirm} onClick={handleDeleteBanner}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

BannerRow.propTypes = {
  banner: PropTypes.object.isRequired,
};

export default BannerRow;
