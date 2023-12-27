import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';

import { selectLogin, selectUser } from '@containers/Client/selectors';
import toast from 'react-hot-toast';
import { setLogin, setToken, setUser, verifyToken } from './actions';

const Client = ({ login, user, allowedRoles, intl: { formatMessage }, children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [hasMounted, setHasMounted] = useState(false);

  const handleError = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(setLogin(false));
  };

  useEffect(() => {
    setHasMounted(false);
    if (!login) {
      return navigate('/login');
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      toast.error(formatMessage({ id: 'app_not_authorized' }));
      return navigate('/');
    }

    dispatch(verifyToken(handleError));
    setHasMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login, navigate]);

  if (!hasMounted) return null;

  return children;
};

Client.propTypes = {
  login: PropTypes.bool,
  user: PropTypes.object,
  allowedRoles: PropTypes.array,
  intl: PropTypes.object,
  children: PropTypes.element,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  user: selectUser,
});

export default injectIntl(connect(mapStateToProps)(Client));
