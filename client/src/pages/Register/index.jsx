/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import BackBtn from '@components/BackBtn';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import toast from 'react-hot-toast';
import { registerUser, sendEmailToken } from '@containers/Client/actions';
import classes from './style.module.scss';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    passwordConfirmation: '',
    gender: '',
    dateOfBirth: '',
    idCard: '',
    name: '',
    email: '',
    emailToken: '',
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordConfirmation = () => setShowPasswordConfirmation((show) => !show);

  const handleMouseDownPasswordConfirmation = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateUsername = () => {
    if (!inputs.username) {
      toast.error('Username cannot be empty');
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    if (!inputs.password) {
      toast.error('Password cannot be empty');
      return false;
    }

    if (inputs.password.length < 6) {
      toast.error('Password must have min 6 characters');
      return false;
    }

    return true;
  };

  const validatePasswordConfirmation = () => {
    if (!inputs.passwordConfirmation) {
      toast.error('You must insert the password confirmation');
      return false;
    }
    if (inputs.passwordConfirmation !== inputs.password) {
      toast.error('Password confirmation must have same value as password');
      return false;
    }

    return true;
  };

  const validateIdCard = () => {
    if (!inputs.idCard) {
      toast.error('You must insert ID Card');
      return false;
    }
    if (inputs.idCard.length !== 16 || !/^\d+$/.test(inputs.idCard)) {
      toast.error('Incorrect ID Card format');
      return false;
    }

    return true;
  };

  const validateEmail = () => {
    if (!inputs.email) {
      toast.error('You must insert email');
      return false;
    }

    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputs.email)) {
      toast.error('Incorrect E-mail format');
      return false;
    }

    return true;
  };

  const handleFocusOut = (e) => {
    if (e.target.name === 'username') {
      validateUsername();
    } else if (e.target.name === 'password') {
      validatePassword();
    } else if (e.target.name === 'passwordConfirmation') {
      validatePasswordConfirmation();
    } else if (e.target.name === 'idCard') {
      validateIdCard();
    } else if (e.target.name === 'email') {
      validateEmail();
    }
  };

  const validateInputs = () => {
    if (!validateUsername()) return false;

    if (!validatePassword()) return false;

    if (!validatePasswordConfirmation()) return false;

    if (!validateIdCard()) return false;

    if (!validateEmail()) return false;

    return true;
  };

  const handleSuccessRegister = () => {
    toast.success('Success registration');
    navigate('/login');
  };

  const handleErrorRegister = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;

    const formattedInputs = { ...inputs };
    formattedInputs.dateOfBirth = new Date(inputs.dateOfBirth).toDateString();
    delete formattedInputs.passwordConfirmation;

    dispatch(registerUser(formattedInputs, handleSuccessRegister, handleErrorRegister));
  };

  const handleSuccessSendEmailToken = () => {
    toast.success('Sent a token via email');
  };

  const handleErrorSendEmailToken = (errorMsg) => {
    toast.error(errorMsg);
    setInputs((prev) => ({ ...prev, email: '' }));
  };

  const handleGenerateEmailToken = () => {
    if (!validateEmail()) return;

    const formattedInputs = { email: inputs.email, action: 'create' };
    dispatch(sendEmailToken(formattedInputs, handleSuccessSendEmailToken, handleErrorSendEmailToken));
  };

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/login')} />
          <h1>Register</h1>
        </header>

        <form>
          <div className={classes.header}>Personal Information</div>
          <div className={classes.input}>
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              name="username"
              id="username"
              value={inputs.username}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              placeholder="Enter the username"
              autoComplete="off"
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="password">Password</label>
            <OutlinedInput
              id="outlined-adornment-password"
              name="password"
              placeholder="Enter the password"
              value={inputs.password}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              className={classes.inputPassword}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label=""
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="passwordConfirmation">Password Confirmation</label>
            <OutlinedInput
              id="outlined-adornment-password"
              name="passwordConfirmation"
              placeholder="Enter password confirmation"
              value={inputs.passwordConfirmation}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              className={classes.inputPassword}
              type={showPasswordConfirmation ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordConfirmation}
                    onMouseDown={handleMouseDownPasswordConfirmation}
                    edge="end"
                  >
                    {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label=""
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="gender">Gender</label>
            <div className={classes.radios}>
              <div className={classes.radio} onClick={() => setInputs((prev) => ({ ...prev, gender: 'Male' }))}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={inputs.gender === 'Male'}
                  onChange={handleInputChange}
                />
                <label>Male</label>
              </div>
              <div className={classes.radio} onClick={() => setInputs((prev) => ({ ...prev, gender: 'Female' }))}>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={inputs.gender === 'Female'}
                  onChange={handleInputChange}
                />
                <label>Female</label>
              </div>
            </div>
          </div>
          <div className={classes.input}>
            <label htmlFor="dateOfBirth">Date of birth</label>
            <DatePicker
              name="dateOfBirth"
              placeholderText="Select your date of birth"
              selected={inputs.dateOfBirth}
              showMonthDropdown
              dropdownMode="select"
              showYearDropdown
              dateFormat="dd/MM/yyyy"
              className={classes.datePicker}
              onChange={(date) => setInputs((prev) => ({ ...prev, dateOfBirth: date }))}
            />
          </div>

          <div className={classes.header}>Certificate Information</div>
          <div className={classes.input}>
            <label htmlFor="idCard">ID Card</label>
            <input
              type="text"
              name="idCard"
              id="idCard"
              value={inputs.idCard}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              placeholder="Please enter your Indonesia ID card"
              autoComplete="off"
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={inputs.name}
              onChange={handleInputChange}
              placeholder="Enter your name on your ID Card"
              autoComplete="off"
            />
          </div>

          <div className={classes.header}>Contact Information</div>
          <div className={classes.input}>
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              name="email"
              id="email"
              value={inputs.email}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              placeholder="Please enter your email address"
              autoComplete="off"
            />
          </div>
          <div className={classes.input}>
            <input
              className={classes.verification}
              type="text"
              name="emailToken"
              id="emailToken"
              value={inputs.emailToken}
              onChange={handleInputChange}
              placeholder="Please enter the verification code"
              autoComplete="off"
            />
            <div className={classes.button}>
              <Button variant="contained" className={classes.btn} onClick={handleGenerateEmailToken}>
                Generate
              </Button>
            </div>
          </div>
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

export default Register;
