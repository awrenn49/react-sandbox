export const CLEAR_REROUTE = 'clear_reroute';

export function clearReroute() {
  return dispatch => {
    dispatch({
      type: CLEAR_REROUTE,
      payload: null
    })   
  }
}