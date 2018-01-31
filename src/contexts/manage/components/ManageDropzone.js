import { connect } from 'react-redux';
import React, { Component } from 'react';

import Dropzone from 'react-dropzone';

class ManageDropzone extends Component {

  super(props){
    this.state = {}
  }
  
  onDrop(files) {
    this.props.onFileDrop(files[0]);
  }

  render() {
    var fileDropText = <div/>
    this.props.isFileDropped ? fileDropText = <p>{this.props.fileDropText}</p> : fileDropText =  <p className="file-drop-error">{this.props.fileDropText}</p>;

    var testString = `test this
    now`
    return (
      <div >
        <Dropzone 
          accept=".jpg, .jpeg, .png"
          onDrop={this.onDrop.bind(this)}
          className="manage-dropzone"
          >
          {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
              if (isDragReject) {
                return <div className="manage-dropzone-text">{`This File Type is Not Accepted`}</div>;
              }
              return acceptedFiles.length || rejectedFiles.length
                ? <div className="manage-dropzone-text">{`Accepted ${acceptedFiles.length} , rejected ${rejectedFiles.length} files`}</div>
                : <div className="manage-dropzone-text display-line-break">
                {`Drop File or Click Here to \n Upload New User Profile Picture`}</div>;
            }}
        </Dropzone>
        {fileDropText}
      </div>
    )
  }
}

export default connect(null, { })(ManageDropzone);