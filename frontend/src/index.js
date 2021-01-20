import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// I want to get that state value from each component file. Why? Because eventually I'm going to send an AJAX request
// to the server with all of the values, so FFmpeg knows what parameters to use for encoding the file.

// So, what I want to do is:
// Get the selected codec from CodecSelector.js
// If MP3 was selected, for example, get the bitrate type from MP3.js, the bitrate from Mp3Cbr.js 
// and the VBR mode from MP3VBR.js
// Send an AJAX request with all of this data. 



ReactDOM.render(
  <Fragment>
    <App/>
  </Fragment>,
  document.getElementById('root')
);