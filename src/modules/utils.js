export const setData = (actionName, payload) => {
    return dispatch => {
        dispatch({ 
            type: actionName, 
            payload: payload
        });
    }
}