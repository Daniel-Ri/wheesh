/* eslint-disable jsx-a11y/label-has-associated-control */
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import BackBtn from '@components/BackBtn';
import { createStructuredSelector } from 'reselect';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import { Button } from '@mui/material';
import { selectLocale } from '@containers/App/selectors';
import { enGB, id } from 'date-fns/locale';
import classes from './style.module.scss';
import { getProfile, updateProfile } from './actions';
import { selectProfile } from './selectors';

const Profile = ({ profile, locale, intl: { formatMessage } }) => {
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

  const [errors, setErrors] = useState({
    username: '',
    dateOfBirth: '',
    idCard: '',
    name: '',
  });

  const [mainError, setMainError] = useState('');

  const today = new Date();
  const isDateAvailable = (date) => date <= today;

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateUsername = () => {
    if (!inputs.username) {
      setErrors((prev) => ({ ...prev, username: formatMessage({ id: 'app_username_cannot_be_empty' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, username: '' }));
    return true;
  };

  const validateDateOfBirth = () => {
    if (!inputs.dateOfBirth) {
      setErrors((prev) => ({ ...prev, dateOfBirth: formatMessage({ id: 'app_must_choose_date_birth' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
    return true;
  };

  const validateIdCard = () => {
    if (!inputs.idCard) {
      setErrors((prev) => ({ ...prev, idCard: formatMessage({ id: 'app_must_insert_id_card' }) }));
      return false;
    }
    if (inputs.idCard.length !== 16 || !/^\d+$/.test(inputs.idCard)) {
      setErrors((prev) => ({ ...prev, idCard: formatMessage({ id: 'app_incorrect_id_card_format' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, idCard: '' }));
    return true;
  };

  const validateName = () => {
    if (!inputs.name) {
      setErrors((prev) => ({ ...prev, name: formatMessage({ id: 'app_must_insert_name' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, name: '' }));
    return true;
  };

  const handleFocusOut = (e) => {
    if (e.target.name === 'username') {
      validateUsername();
    } else if (e.target.name === 'dateOfBirth') {
      validateDateOfBirth();
    } else if (e.target.name === 'idCard') {
      validateIdCard();
    } else if (e.target.name === 'name') {
      validateName();
    }
  };

  const validateInputs = () => {
    const validatedUsername = validateUsername();
    const validatedDateOfBirth = validateDateOfBirth();
    const validatedIdCard = validateIdCard();
    const validatedName = validateName();

    if (!validatedUsername || !validatedDateOfBirth || !validatedIdCard || !validatedName) {
      return false;
    }

    return true;
  };

  const handleSuccess = () => {
    toast.success(formatMessage({ id: 'app_success_modify_profile' }));
    navigate('/me');
  };

  const handleError = (errorMsg) => {
    setMainError(errorMsg);
  };

  const handleSubmit = () => {
    setErrors({ username: '', dateOfBirth: '', idCard: '', name: '' });
    setMainError('');
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
    <main data-testid="Profile" className={classes.main}>
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
          <div className={classes.header}>
            <FormattedMessage id="app_personal_information" />
          </div>
          <div className={classes.input}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={inputs.username}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              disabled={!isEdit}
              placeholder={formatMessage({ id: 'app_enter_the_username' })}
              autoComplete="off"
            />
          </div>
          {errors.username && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.username}</div>
            </div>
          )}

          <div className={classes.input}>
            <label htmlFor="gender">
              <FormattedMessage id="app_gender" />
            </label>
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
                <label>
                  <FormattedMessage id="app_male" />
                </label>
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
                <label>
                  <FormattedMessage id="app_female" />
                </label>
              </div>
            </div>
          </div>
          <div className={classes.input}>
            <label htmlFor="dateOfBirth">
              <FormattedMessage id="app_date_of_birth" />
            </label>
            <div className={classes.datePickerWrapper}>
              <DatePicker
                name="dateOfBirth"
                locale={locale === 'id' ? id : enGB}
                placeholderText={formatMessage({ id: 'app_select_your_date_of_birth' })}
                selected={inputs.dateOfBirth}
                showMonthDropdown
                dropdownMode="select"
                showYearDropdown
                dateFormat="dd/MM/yyyy"
                filterDate={isDateAvailable}
                className={classes.datePicker}
                onChange={(date) => setInputs((prev) => ({ ...prev, dateOfBirth: date }))}
                onBlur={handleFocusOut}
                disabled={!isEdit}
              />
            </div>
          </div>
          {errors.dateOfBirth && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.dateOfBirth}</div>
            </div>
          )}

          <div className={classes.header}>
            <FormattedMessage id="app_certificate_information" />
          </div>
          <div className={classes.input}>
            <label htmlFor="idCard">
              <FormattedMessage id="app_id_card" />
            </label>
            <input
              type="text"
              name="idCard"
              id="idCard"
              value={inputs.idCard}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              disabled={!isEdit}
              placeholder={formatMessage({ id: 'app_please_enter_your_id' })}
              autoComplete="off"
            />
          </div>
          {errors.idCard && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.idCard}</div>
            </div>
          )}

          <div className={classes.input}>
            <label htmlFor="name">
              <FormattedMessage id="app_name" />
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={inputs.name}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              disabled={!isEdit}
              placeholder={formatMessage({ id: 'app_enter_name_on_your_id' })}
              autoComplete="off"
            />
          </div>
          {errors.name && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.name}</div>
            </div>
          )}

          <div className={classes.header}>
            <FormattedMessage id="app_contact_information" />
          </div>
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
              autoComplete="off"
            />
          </div>
        </form>

        {mainError && <div className={classes.mainError}>{mainError}</div>}

        {isEdit && (
          <div className={classes.buttons}>
            <Button variant="contained" className={classes.submit} onClick={handleSubmit}>
              <FormattedMessage id="app_submit_changes" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

Profile.propTypes = {
  profile: PropTypes.object,
  locale: PropTypes.string,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  profile: selectProfile,
  locale: selectLocale,
});

export default injectIntl(connect(mapStateToProps)(Profile));
