import { combineReducers } from 'redux';
import { reducer as formReducer} from 'redux-form';
import CalendarReducer from './reducer_calendar';
import LoginReducer from './reducer_login';
import NotificationReducer from './reducer_notification';
import PersistReducer from './reducer_persist';
import PollingReducer from './reducer_polling';
import RegistrationReducer from './reducer_registration';
import RosterReducer from './reducer_roster';
import SchoolsReducer from './reducer_schools';
import LoadingReducer from './reducer_loading';
import RerouteReducer from './reducer_reroute';

const rootReducer = combineReducers({
  calendarEvents : CalendarReducer,
  form : formReducer,
  loginState : LoginReducer,
  notifications : NotificationReducer,
  persist: PersistReducer,
  pollingInfo : PollingReducer,
  registration : RegistrationReducer,
  schools : SchoolsReducer,
  rosters : RosterReducer,
  loading : LoadingReducer,
  reroute : RerouteReducer
});

export default rootReducer;
