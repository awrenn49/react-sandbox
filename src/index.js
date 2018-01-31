import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist'
import thunk from 'redux-thunk';
import localForage from 'localforage';
import { createFilter } from 'redux-persist-transform-filter';

import {Image, Grid, Row, Col} from 'react-bootstrap';

import Authorization from './contexts/utils/Authorization';

import reducers from './reducers';

import Sidebar from './contexts/sidebar/Sidebar';

import AnalyticsScaffold from './contexts/analytics/components/AnalyticsScaffold';
import Calendar from './contexts/calendar/components/Calendar';
import ForgotPassword from './contexts/profile_settings/components/ForgotPassword';
import Login from './contexts/login/components/Login';
import Logout from './contexts/login/components/Logout';
import Manage from './contexts/manage/components/Manage';
import NotificationScaffold from './contexts/notifications/components/NotificationScaffold';
import PollingScaffold from './contexts/polling/components/Polling_Scaffold';
import Registration from './contexts/registration/components/Registration';
import Roster from './contexts/roster/components/Roster';

import App from './App';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const middleware = [thunk];
const saveSubsetFilter = createFilter(
  reducers,
  ['login', 'reroute']
);
let store = compose(
  applyMiddleware(...middleware),
  autoRehydrate()
)(createStore)(reducers);
persistStore(store,{
 transforms: [
    saveSubsetFilter
  ]
});

const Admin = Authorization();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('content'));
