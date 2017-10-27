import React, { Component } from 'react'
import {Well, Row} from 'react-bootstrap';

class Footer extends Component{
  
  render(){
    return (    
    <Well>
      <Row>
        <footer className="footer text-center">
          <div className="container">
            <p className="footer-text">
              Copyright 2017 Company. All rights reserved
            </p>
          </div>
        </footer>
      </Row>
    </Well>
    )
  }
}

export default Footer