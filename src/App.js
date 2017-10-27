import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
import Footer from './components/footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map />
        <Footer />
      </div>
    );
  }
}

export default App;
