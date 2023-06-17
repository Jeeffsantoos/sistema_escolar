/* eslint-disable import/no-extraneous-dependencies */
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore } from "redux-persist";
import persistedReducers from "./modules/reduxPersist";

import rootSaga from "./modules/rootSaga";
import rootReducer from "./modules/rootReducer";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  persistedReducers(rootReducer),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store;
