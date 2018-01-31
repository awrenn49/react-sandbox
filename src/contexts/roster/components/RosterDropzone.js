import { connect } from 'react-redux';
import React, { Component } from 'react';

import Dropzone from 'react-dropzone';

class RosterDropzone extends Component {

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
          accept=".csv"
          onDrop={this.onDrop.bind(this)}
          className="roster-dropzone"
          >
          {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
              return acceptedFiles.length || rejectedFiles.length
                ? <div className="roster-dropzone-text">{`Accepted ${acceptedFiles.length} , rejected ${rejectedFiles.length} files`}</div>
                : <div className="roster-dropzone-text">{`Drop File or Click Here to Upload New Roster`}</div>;
            }}
        </Dropzone>
      </div>
    )
  }
}

export default connect(null, { })(RosterDropzone);