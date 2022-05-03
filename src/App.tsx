import React from 'react';
import logo from './logo.svg';
import Rank from './components/Rank'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
        <Rank name='TastyMango69' />
        </div>
      </header>
    </div>
  );
}

export default App;
