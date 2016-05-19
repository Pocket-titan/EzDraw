import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.js'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const RealApp = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <App />
  </MuiThemeProvider>
)

ReactDOM.render(<RealApp />, document.getElementById('app'))
