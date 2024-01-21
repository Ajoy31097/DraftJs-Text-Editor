import React from 'react';
import TextEditor from './Texteditor';

function App() {
  return (
    <div className="App">
      <div className='header'>
      <h1 style={{marginLeft: "38%", color: "black", textDecoration: "underline"}}>React Draft.js Text Editor</h1>
      </div>
      <TextEditor />
    </div>
  );
}

export default App;
