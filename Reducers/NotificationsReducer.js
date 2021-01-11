/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
const initialState = {
    notifications: {}
};
const NotificationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_NOTIFICATIONS": {
            return {
                ...state,
                notifications: action.notifications
            }
        }
        default: {
            return state;
        }
    }
}
export default NotificationsReducer;