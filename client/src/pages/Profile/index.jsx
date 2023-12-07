/* eslint-disable jsx-a11y/label-has-associated-control */
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import BackBtn from '@components/BackBtn';
import { createStructuredSelector } from 'reselect';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import { Button } from '@mui/material';
import classes from './style.module.scss';
import { getProfile, updateProfile } from './actions';
import { selectProfile } from './selectors';

const Profile = ({ profile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);

  const [inputs, setInputs] = useState({
    username: '',
    gender: '',
    dateOfBirth: null,
    idCard: '',
    name: '',
    email: '',
  });

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

  const handleFocusOut = (e) => {
    if (e.target.name === 'username') {
      validateUsername();
    } else if (e.target.name === 'idCard') {
      validateIdCard();
    }
  };

  const validateInputs = () => {
    if (!validateUsername()) return false;

    if (!validateIdCard()) return false;

    return true;
  };

  const handleSuccess = () => {
    toast.success('Success modify profile');
    navigate('/me');
  };

  const handleError = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;

    const formattedInputs = { ...inputs };
    formattedInputs.dateOfBirth = new Date(inputs.dateOfBirth).toDateString();
    delete formattedInputs.email;

    dispatch(updateProfile(inputs, handleSuccess, handleError));
  };

  useEffect(() => {
    dispatch(getProfile());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile) {
      setInputs({
        username: profile.username,
        gender: profile.Passengers[0].gender,
        dateOfBirth: new Date(profile.Passengers[0].dateOfBirth),
        idCard: profile.Passengers[0].idCard,
        name: profile.Passengers[0].name,
        email: profile.email,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/me')} />
          <div className={classes.empty} />
          <h1>Profile</h1>
          {profile && !isEdit ? (
            <div className={classes.edit} onClick={() => setIsEdit(true)}>
              Edit
            </div>
          ) : (
            <div className={classes.empty} />
          )}
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
              disabled={!isEdit}
              placeholder="Enter the username"
              autoComplete="off"
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
                  disabled={!isEdit}
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
                  disabled={!isEdit}
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
              disabled={!isEdit}
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
              disabled={!isEdit}
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
              disabled={!isEdit}
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
              disabled
              placeholder="Please enter your email address"
              autoComplete="off"
            />
          </div>
        </form>

        {isEdit && (
          <div className={classes.buttons}>
            <Button variant="contained" className={classes.submit} onClick={handleSubmit}>
              Submit Changes
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

Profile.propTypes = {
  profile: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  profile: selectProfile,
});

export default connect(mapStateToProps)(Profile);
