export const START_LOADING = 'start_loading';
export const STOP_LOADING = 'stop_loading';

export function startLoading() {
  var loading = {isLoadingNow : true};
  return dispatch => {
    dispatch({
      type: START_LOADING,
      payload: loading
    })
  }
}

export function stopLoading() {
  var loading = {isLoadingNow : false};
  return dispatch => {
    dispatch({
      type: STOP_LOADING,
      payload: loading   
    })
  }
}