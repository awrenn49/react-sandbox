import {Image, Grid, Row, Col} from 'react-bootstrap';
import React, { Component} from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

import Papa from 'papaparse';
import ReactTable from 'react-table';

import RosterDropzone from './RosterDropzone';

import 'react-table/react-table.css'

import { addRoster } from '../actions/roster_action';

class RosterUpload extends Component {


  constructor(props){
    super(props);
    this.uploadTeacherRoster = this.uploadTeacherRoster.bind(this);
  }

  uploadTeacherRoster(results, file) {
    var schoolId;
    var districtId;
    this.props.loginState.teacherInfo ? schoolId = this.props.loginState.teacherInfo.schoolId : null
    this.props.loginState.teacherInfo ? districtId = this.props.loginState.teacherInfo.districtId : null
    this.props.addRoster(results.data, schoolId, districtId, this.props.uploadType);
    
  }


  fileDrop(file){

    var config = {
      delimiter: "",  // auto-detect
      newline: "",  // auto-detect
      quoteChar: '"',
      header: true,
      dynamicTyping: false,
      preview: 0,
      encoding: "",
      worker: false,
      comments: false,
      step: undefined,
      complete: this.uploadTeacherRoster,
      error: undefined,
      download: false,
      skipEmptyLines: false,
      chunk: undefined,
      fastMode: undefined,
      beforeFirstChunk: undefined,
      withCredentials: undefined
    }
    Papa.parse(file, config)
  }

  render(){
    return(
      <div>
        <RosterDropzone 
          onFileDrop={this.fileDrop.bind(this)}
        />
      </div>
    )   
  }
}

function mapStateToProps(state){
  var self = this;
  return { loginState: state.loginState }
}


export default connect(mapStateToProps, { addRoster })(RosterUpload);

 