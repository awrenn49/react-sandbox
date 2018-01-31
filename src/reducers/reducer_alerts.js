import { CREATE_TEACHER_NOTIFICATION, CREATE_ADMIN_NOTIFICATION } from '../contexts/notifications/actions/notification_action';
import { CREATE_POLL } from '../contexts/polling/actions/polling_action';

export default function(state = {}, action) {
  switch (action.type) {
    case CREATE_TEACHER_NOTIFICATION:
      alert('New Notification Created!')
      return action.payload;
    case CREATE_ADMIN_NOTIFICATION:
      alert('New Notification Created!')
      return action.payload;
    case CREATE_POLL:
      alert('New Poll Create!')
      return action.payload;
  }
  return state;
}