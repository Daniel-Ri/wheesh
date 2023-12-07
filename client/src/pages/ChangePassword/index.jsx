import { useDispatch } from 'react-redux';

import BackBtn from '@components/BackBtn';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import classes from './style.module.scss';
import { changePassword } from './actions';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  });

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
      toast.error('You must insert the original password');
      return false;
    }

    return true;
  };

  const validateNewPassword = () => {
    if (!inputs.newPassword) {
      toast.error('New password cannot be empty');
      return false;
    }

    if (inputs.newPassword.length < 6) {
      toast.error('New password must have min 6 characters');
      return false;
    }

    return true;
  };

  const validateNewPasswordConfirmation = () => {
    if (!inputs.newPasswordConfirmation) {
      toast.error('You must insert the password confirmation');
      return false;
    }
    if (inputs.newPasswordConfirmation !== inputs.newPassword) {
      toast.error('Password confirmation must have same value as new password');
      return false;
    }

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
    if (!validateOldPassword()) return false;

    if (!validateNewPassword()) return false;

    if (!validateNewPasswordConfirmation()) return false;

    return true;
  };

  const handleSuccess = () => {
    toast.success('Success modify password');
    navigate('/me');
  };

  const handleError = (errorMsg) => {
    toast.error(errorMsg);
    setInputs({ oldPassword: '', newPassword: '', newPasswordConfirmation: '' });
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;

    const formattedInputs = { ...inputs };
    delete formattedInputs.newPasswordConfirmation;

    dispatch(changePassword(formattedInputs, handleSuccess, handleError));
  };

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/me')} />
          <h1>Change Password</h1>
        </header>

        <form>
          <OutlinedInput
            id="outlined-adornment-password"
            name="oldPassword"
            placeholder="Enter the original password"
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
          <OutlinedInput
            id="outlined-adornment-password"
            name="newPassword"
            placeholder="Enter new password"
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
          <OutlinedInput
            id="outlined-adornment-password"
            name="newPasswordConfirmation"
            placeholder="Re-enter your new password"
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
        </form>

        <div className={classes.buttons}>
          <Button variant="contained" className={classes.submit} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;
