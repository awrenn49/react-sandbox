import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist'
import thunk from 'redux-thunk';
import localForage from 'localforage';
import { createFilter } from 'redux-persist-transform-filter';

import reducers from './reducers';

import App from './App';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const middleware = [thunk];
const saveSubsetFilter = createFilter(
  reducers,
  []
);
//Add parts of store you want persisted in here
let store = compose(
  applyMiddleware(...middleware),
  autoRehydrate()
)(createStore)(reducers);
persistStore(store,{
 transforms: [
    saveSubsetFilter
  ]
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('content'));
