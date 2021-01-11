/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../Reducers/index';
// Middleware: Redux Persist Config
const persistConfig = {
    key: 'notifications',
    storage: AsyncStorage,
    whitelist: [
        "NotificationsReducer"
    ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(
    persistedReducer,
    applyMiddleware(
        createLogger(),
    ),
);
let persistor = persistStore(store);
export {
    store,
    persistor,
};