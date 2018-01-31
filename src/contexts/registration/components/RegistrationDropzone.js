import { connect } from 'react-redux';
import React, { Component } from 'react';

import Dropzone from 'react-dropzone';

class RegistrationDropzone extends Component {

  super(props){
    this.state = {}
  }
  
  onDrop(files) {
    this.props.onFileDrop(files[0]);
  }

  render() {
    var fileDropText = <div/>
    this.props.isFileDropped ? fileDropText = <p>{this.props.fileDropText}</p> : fileDropText =  <p className="file-drop-error">{this.props.fileDropText}</p>;

    return (
      <div >
        <Dropzone 
          accept=".jpg, .jpeg, .png"
          onDrop={this.onDrop.bind(this)}
          className="roster-dropzone"
          >
          {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
              if (isDragReject) {
                return <div className="roster-dropzone-text">{`This File Type is Not Accepted`}</div>;
              }
              return acceptedFiles.length || rejectedFiles.length
                ? <div className="roster-dropzone-text">{`Accepted ${acceptedFiles.length} , rejected ${rejectedFiles.length} files`}</div>
                : <div className="roster-dropzone-text">{`Drop File or Click Here to Upload New User Profile Picture`}</div>;
            }}
        </Dropzone>
        {fileDropText}
      </div>
    )
  }
}

export default connect(null, { })(RegistrationDropzone);