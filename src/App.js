import React, {Component, useEffect, useState} from 'react';
import AddAddress from "./addAddress";
import {BrowserRouter, Route} from 'react-router-dom'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ''
    }
  }

  addAddress = (address) => {
    this.setState({
      address: address
    })
  }

  render() {
    return (
      <Route path={`/${this.state.address}`}>
      <React.Fragment>
        <div>
          {this.state.address}
        </div>
      </React.Fragment>
      </Route>

    )
  }


}

export default App