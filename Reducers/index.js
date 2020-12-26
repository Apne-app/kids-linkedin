/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import { combineReducers } from 'redux';
// Imports: Reducers
import NotificationsReducer from "./NotificationsReducer"

// Redux: Root Reducer
const rootReducer = combineReducers({

    NotificationsReducer: NotificationsReducer
});

// Exports
export default rootReducer;