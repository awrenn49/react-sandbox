import {Image, Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';
import moment from 'moment'; 

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

class TimePickerCustom extends Component {


  super(props){
    
  }

  render(){

    const format = 'h:mm a';
    const now = moment().hour(0).minute(0);
    const { input : { value, onChange } } = this.props;
    
    return(
      <div>
        <TimePicker
          showSecond={false}
          defaultValue={now}
          className="xxx"
          onChange={onChange}
          format={format}
          use12Hours
        />
      </div>
    )
  }

}

export default TimePickerCustom;
