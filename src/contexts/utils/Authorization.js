import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Authorization HOC
export default function Authorization (allowedRoles){
  return function(WrappedComponent) {
     class WithAuthorization extends React.Component {
      constructor(props) {
        super(props)
      }

      render() {
        
        if (this.props.testState.loginState && this.props.testState.loginState.isLoggedIn ==  true) {
          return <WrappedComponent {...this.props} />
        } else {
          return  <div className="disabled-message"> 
                    <p className="disabled-message">Page disabled, please click<Link className="disabled-message" to={'/login'}> HERE </Link>to login.</p>
                  </div>
        }
      }
    }      

    function mapStateToProps(state){
      var self = this;
      return { testState: state }
    }

    return connect(mapStateToProps, { })(WithAuthorization)
  }
}
