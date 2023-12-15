import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLogin } from '@containers/Client/selectors';
import { setLogin, setToken, setUser, verifyToken } from './actions';

const Client = ({ login, children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleError = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(setLogin(false));
  };

  useEffect(() => {
    if (!login) {
      navigate('/login');
    }

    dispatch(verifyToken(handleError));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login, navigate]);

  return children;
};

Client.propTypes = {
  login: PropTypes.bool,
  children: PropTypes.element,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
});

export default connect(mapStateToProps)(Client);
