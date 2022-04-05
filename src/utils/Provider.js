import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack';
import { CookiesProvider } from 'react-cookie';
import CssBaseline from '@material-ui/core/CssBaseline';

import '../index.css';
import 'beautiful-react-diagrams/styles.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import '../i18n';
import CustomThemeProvider from './CustomThemeProvider';


const ProviderWrapper = ({ children, store, history }) => (
  <Provider store={store}>
    <CustomThemeProvider>
      <CookiesProvider>
        <ConnectedRouter history={history}>
          <SnackbarProvider
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }} maxSnack={3}>
            <CssBaseline />
            {children}
          </SnackbarProvider>
        </ConnectedRouter>
      </CookiesProvider>
    </CustomThemeProvider>
  </Provider>
)

export default ProviderWrapper