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

  const [errors, setErrors] = useState({
    email: '',
    emailToken: '',
  });

  const [mainError, setMainError] = useState('');

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = () => {
    if (!inputs.email) {
      setErrors((prev) => ({ ...prev, email: formatMessage({ id: 'app_you_must_insert_email' }) }));
      return false;
    }

    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputs.email)) {
      setErrors((prev) => ({ ...prev, email: formatMessage({ id: 'app_incorrect_email_format' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const validateEmailToken = () => {
    if (!inputs.emailToken) {
      setErrors((prev) => ({ ...prev, emailToken: formatMessage({ id: 'app_must_insert_verification_code' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, emailToken: '' }));
    return true;
  };

  const handleFocusOut = (e) => {
    if (e.target.name === 'email') {
      validateEmail();
    } else if (e.target.name === 'emailToken') {
      validateEmailToken();
    }
  };

  const validateInputs = () => {
    const validatedEmail = validateEmail();
    const validatedEmailToken = validateEmailToken();

    if (!validatedEmail || !validatedEmailToken) return false;

    return true;
  };

  const handleSuccessChange = () => {
    toast.success(formatMessage({ id: 'app_success_modify_email' }));
    navigate('/me');
  };

  const handleErrorChange = (errorMsg) => {
    setMainError(errorMsg);
  };

  const handleSubmit = () => {
    setErrors({
      email: '',
      emailToken: '',
    });
    setMainError('');
    if (!validateInputs()) return;

    dispatch(changeEmail(inputs, handleSuccessChange, handleErrorChange));
  };

  const handleSuccessSendEmailToken = () => {
    toast.success(formatMessage({ id: 'app_sent_a_token_email' }));
  };

  const handleErrorSendEmailToken = (errorMsg) => {
    setErrors((prev) => ({ ...prev, email: errorMsg }));
    setInputs((prev) => ({ ...prev, email: '' }));
  };

  const handleGenerateEmailToken = () => {
    if (!validateEmail()) return;
    setInputs((prev) => ({ ...prev, emailToken: '' }));

    const formattedInputs = { email: inputs.email, action: 'update' };
    dispatch(sendEmailToken(formattedInputs, handleSuccessSendEmailToken, handleErrorSendEmailToken));
  };

  return (
    <main data-testid="ChangeEmail" className={classes.main}>
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
              onBlur={handleFocusOut}
              placeholder={formatMessage({ id: 'app_please_enter_new_email' })}
              autoComplete="off"
            />
          </div>
          {errors.email && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.email}</div>
            </div>
          )}

          <div className={classes.input}>
            <input
              className={classes.verification}
              type="text"
              name="emailToken"
              id="emailToken"
              value={inputs.emailToken}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              placeholder={formatMessage({ id: 'app_please_enter_verification_code' })}
              autoComplete="off"
            />
            <div className={classes.button}>
              <Button variant="contained" className={classes.btn} onClick={handleGenerateEmailToken}>
                <FormattedMessage id="app_generate" />
              </Button>
            </div>
          </div>
          {errors.emailToken && (
            <div className={classes.errorRow}>
              <div className={classes.errorMsg}>{errors.emailToken}</div>
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

ChangeEmail.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(ChangeEmail);
