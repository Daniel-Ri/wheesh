import { FormattedMessage } from 'react-intl';
import classes from './style.module.scss';

// eslint-disable-next-line arrow-body-style
const Footer = () => {
  // eslint-disable-next-line prettier/prettier
  return (
    <div className={classes.footer}>
      <div className={classes.container}>
        <hr />
        <div className={classes.author}>
          <FormattedMessage id="app_website_created_by" />{' '}
          <a href="https://www.linkedin.com/in/daniel-riyanto-34b08b1aa/" target="_blank" rel="noreferrer">
            Daniel Riyanto
          </a>
        </div>
        <div className={classes.socialIcons}>
          <a href="https://www.linkedin.com/in/daniel-riyanto-34b08b1aa/" target="_blank" rel="noreferrer">
            <img src="/linkedin.svg" alt="LinkedIn" />
          </a>
          <a href="https://github.com/Daniel-Ri" target="_blank" rel="noreferrer">
            <img src="/github.svg" alt="Github" />
          </a>
          <a href="mailto:danielriyanto190700@gmail.com">
            <img src="/gmail.svg" alt="GMail" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
