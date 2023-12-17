/* eslint-disable jsx-a11y/label-has-associated-control */
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import BackBtn from '@components/BackBtn';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import toast from 'react-hot-toast';
import { sendEmailToken } from '@containers/Client/actions';
import { Button } from '@mui/material';
import { changeEmail } from './actions';

import classes from './style.module.scss';

const ChangeEmail = ({ intl: { formatMessage } }) => {
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
      toast.error(formatMessage({ id: 'app_you_must_insert_email' }));
      return false;
    }

    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputs.email)) {
      toast.error(formatMessage({ id: 'app_incorrect_email_format' }));
      return false;
    }

    return true;
  };

  const handleSuccessChange = () => {
    toast.success(formatMessage({ id: 'app_success_modify_email' }));
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
    toast.success(formatMessage({ id: 'app_sent_a_token_email' }));
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
          <h1>
            <FormattedMessage id="app_change_email" />
          </h1>
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
              placeholder={formatMessage({ id: 'app_please_enter_new_email' })}
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
              placeholder={formatMessage({ id: 'app_please_enter_verification_code' })}
              autoComplete="off"
            />
            <div className={classes.button}>
              <Button variant="contained" className={classes.btn} onClick={handleGenerateEmailToken}>
                <FormattedMessage id="app_generate" />
              </Button>
            </div>
          </div>
        </form>

        <div className={classes.buttons}>
          <Button variant="contained" className={classes.submit} onClick={handleSubmit}>
            <FormattedMessage id="app_submit" />
          </Button>
        </div>
      </div>
    </main>
  );
};

ChangeEmail.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(ChangeEmail);
