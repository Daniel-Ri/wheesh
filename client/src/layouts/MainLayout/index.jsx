import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLocale, selectTheme } from '@containers/App/selectors';

import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import classes from './style.module.scss';

const MainLayout = ({ children, locale, theme, intl: { formatMessage } }) => (
  <div className={classes.mainLayout}>
    <Navbar title={formatMessage({ id: 'app_title_header' })} locale={locale} theme={theme} />
    {children}
    <Footer />
  </div>
);

const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
  theme: selectTheme,
});

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string,
  theme: PropTypes.string,
  intl: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(MainLayout));
