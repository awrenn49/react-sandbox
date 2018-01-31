import { connect } from 'react-redux';
import React, { Component } from 'react';

import Dropzone from 'react-dropzone';

class MyDropzone extends Component {

  super(props){
    this.state = {}
  }
  
  onDrop(files) {
    if(files){
      this.props.onFileDrop(files[0]);
    }
  }

  render() {
    return (
      <div >
        <Dropzone 
          accept=".csv, .xls"
          onDrop={this.onDrop.bind(this)}
          className="roster-dropzone"
          >
          {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
              if (isDragReject) {
                return <div className="roster-dropzone-text">{`This File Type is Not Accepted`}</div>;
              }
              return acceptedFiles.length || rejectedFiles.length
                ? <div className="roster-dropzone-text">{`Accepted ${acceptedFiles.length} , rejected ${rejectedFiles.length} files`}</div>
                : <div className="roster-dropzone-text">{`Drop File or Click Here to Upload New Roster`}</div>;
            }}
        </Dropzone>
      </div>
    )
  }
}

export default connect(null, { })(MyDropzone);