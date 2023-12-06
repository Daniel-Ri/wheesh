import { useDispatch } from 'react-redux';

// eslint-disable-next-line import/no-absolute-path
import wheeshIcon from '/wheesh.png';
import { useEffect, useState } from 'react';
import { Button, FormControl, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@containers/Client/actions';
import toast from 'react-hot-toast';
import classes from './style.module.scss';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [ableLogin, setAbleLogin] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSuccess = () => {
    navigate('/');
  };

  const handleError = (errorMsg) => {
    toast.error(errorMsg);
    setInputs({ usernameOrEmail: '', password: '' });
  };

  const clickLogin = () => {
    dispatch(loginUser(inputs, handleSuccess, handleError));
  };

  useEffect(() => {
    if (inputs.usernameOrEmail && inputs.password) {
      setAbleLogin(true);
    } else {
      setAbleLogin(false);
    }
  }, [inputs.usernameOrEmail, inputs.password]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <img src={wheeshIcon} alt="App Icon" />
        </header>
        <div className={classes.message}>
          <div className={classes.mainMsg}>Please enter your account and password</div>
          <div className={classes.subMsg}>Please log in using your registered username or email</div>
        </div>
        <form>
          <input
            type="text"
            name="usernameOrEmail"
            id="usernameOrEmail"
            value={inputs.usernameOrEmail}
            onChange={handleInputChange}
            placeholder="Enter username or email"
            autoComplete="off"
          />
          <FormControl variant="outlined">
            {/* eslint-disable-next-line react/self-closing-comp */}
            {/* <InputLabel htmlFor="outlined-adornment-password"></InputLabel> */}
            <OutlinedInput
              id="outlined-adornment-password"
              name="password"
              placeholder="Enter the password"
              value={inputs.password}
              onChange={handleInputChange}
              className={classes.input}
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
          </FormControl>
        </form>
        <div className={classes.buttons}>
          <Button variant="contained" disabled={!ableLogin} className={classes.login} onClick={clickLogin}>
            Login
          </Button>
          <Button variant="outlined" className={classes.register} onClick={() => navigate('/register')}>
            Register
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Login;
