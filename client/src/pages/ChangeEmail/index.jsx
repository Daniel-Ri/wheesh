/* eslint-disable jsx-a11y/label-has-associated-control */
import { useDispatch } from 'react-redux';

import BackBtn from '@components/BackBtn';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import toast from 'react-hot-toast';
import { sendEmailToken } from '@containers/Client/actions';
import { Button } from '@mui/material';
import classes from './style.module.scss';
import { changeEmail } from './actions';

const ChangeEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    email: '',
    emailToken: '',
  });

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleSuccessChange = () => {
    toast.success('Success modify email');
    navigate('/me');
  };

  const handleErrorChange = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleSubmit = () => {
    if (!validateEmail()) return;

    dispatch(changeEmail(inputs, handleSuccessChange, handleErrorChange));
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

    const formattedInputs = { email: inputs.email, action: 'update' };
    dispatch(sendEmailToken(formattedInputs, handleSuccessSendEmailToken, handleErrorSendEmailToken));
  };

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/me')} />
          <h1>Change Email</h1>
        </header>

        <form>
          <div className={classes.input}>
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              name="email"
              id="email"
              value={inputs.email}
              onChange={handleInputChange}
              placeholder="Please enter new email address"
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

export default ChangeEmail;
