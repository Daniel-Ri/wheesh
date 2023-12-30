import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import BackBtn from '@components/BackBtn';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import classes from './style.module.scss';
import { changePassword } from './actions';

const ChangePassword = ({ intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  });

  const [mainError, setMainError] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false);

  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);

  const handleMouseDownOldPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowNewPasswordConfirmation = () => setShowNewPasswordConfirmation((show) => !show);

  const handleMouseDownNewPasswordConfirmation = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateOldPassword = () => {
    if (!inputs.oldPassword) {
      setErrors((prev) => ({ ...prev, oldPassword: formatMessage({ id: 'app_must_insert_original_password' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, oldPassword: '' }));
    return true;
  };

  const validateNewPassword = () => {
    if (!inputs.newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: formatMessage({ id: 'app_new_password_cannot_empty' }) }));
      return false;
    }

    if (inputs.newPassword.length < 6) {
      setErrors((prev) => ({ ...prev, newPassword: formatMessage({ id: 'app_new_password_have_characters' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, newPassword: '' }));
    return true;
  };

  const validateNewPasswordConfirmation = () => {
    if (!inputs.newPasswordConfirmation) {
      setErrors((prev) => ({
        ...prev,
        newPasswordConfirmation: formatMessage({ id: 'app_must_insert_password_confirmation' }),
      }));
      return false;
    }
    if (inputs.newPasswordConfirmation !== inputs.newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPasswordConfirmation: formatMessage({ id: 'app_confirmation_must_same_new' }),
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, newPasswordConfirmation: '' }));
    return true;
  };

  const handleFocusOut = (e) => {
    if (e.target.name === 'oldPassword') {
      validateOldPassword();
    } else if (e.target.name === 'newPassword') {
      validateNewPassword();
    } else if (e.target.name === 'newPasswordConfirmation') {
      validateNewPasswordConfirmation();
    }
  };

  const validateInputs = () => {
    const validatedOldPassword = validateOldPassword();
    const validatedNewPassword = validateNewPassword();
    const validatedNewPasswordConfirmation = validateNewPasswordConfirmation();

    if (!validatedOldPassword || !validatedNewPassword || !validatedNewPasswordConfirmation) {
      return false;
    }

    return true;
  };

  const handleSuccess = () => {
    toast.success(formatMessage({ id: 'app_success_modify_password' }));
    navigate('/me');
  };

  const handleError = (errorMsg) => {
    setMainError(errorMsg);
    setInputs({ oldPassword: '', newPassword: '', newPasswordConfirmation: '' });
  };

  const handleSubmit = () => {
    setErrors({
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    });
    setMainError('');
    if (!validateInputs()) return;

    const formattedInputs = { ...inputs };
    delete formattedInputs.newPasswordConfirmation;

    dispatch(changePassword(formattedInputs, handleSuccess, handleError));
  };

  return (
    <main data-testid="ChangePassword" className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/me')} />
          <h1>
            <FormattedMessage id="app_change_password" />
          </h1>
        </header>

        <form>
          <OutlinedInput
            id="outlined-adornment-password"
            name="oldPassword"
            placeholder={formatMessage({ id: 'app_enter_the_original_password' })}
            value={inputs.oldPassword}
            onChange={handleInputChange}
            onBlur={handleFocusOut}
            className={classes.inputPassword}
            type={showOldPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowOldPassword}
                  onMouseDown={handleMouseDownOldPassword}
                  edge="end"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label=""
          />
          {errors.oldPassword && (
            <div className={classes.errorRow}>
              <div className={classes.errorMsg}>{errors.oldPassword}</div>
            </div>
          )}

          <OutlinedInput
            id="outlined-adornment-password"
            name="newPassword"
            placeholder={formatMessage({ id: 'app_enter_new_password' })}
            value={inputs.newPassword}
            onChange={handleInputChange}
            onBlur={handleFocusOut}
            className={classes.inputPassword}
            type={showNewPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowNewPassword}
                  onMouseDown={handleMouseDownNewPassword}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label=""
          />
          {errors.newPassword && (
            <div className={classes.errorRow}>
              <div className={classes.errorMsg}>{errors.newPassword}</div>
            </div>
          )}

          <OutlinedInput
            id="outlined-adornment-password"
            name="newPasswordConfirmation"
            placeholder={formatMessage({ id: 'app_reenter_your_new_password' })}
            value={inputs.newPasswordConfirmation}
            onChange={handleInputChange}
            onBlur={handleFocusOut}
            className={classes.inputPassword}
            type={showNewPasswordConfirmation ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowNewPasswordConfirmation}
                  onMouseDown={handleMouseDownNewPasswordConfirmation}
                  edge="end"
                >
                  {showNewPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label=""
          />
          {errors.newPasswordConfirmation && (
            <div className={classes.errorRow}>
              <div className={classes.errorMsg}>{errors.newPasswordConfirmation}</div>
            </div>
          )}
        </form>

        {mainError && <div className={classes.mainError}>{mainError}</div>}

        <div className={classes.buttons}>
          <Button variant="contained" className={classes.submit} onClick={handleSubmit}>
            <FormattedMessage id="app_submit" />
          </Button>
        </div>
      </div>
    </main>
  );
};

ChangePassword.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(ChangePassword);
