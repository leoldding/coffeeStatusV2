import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Main from './components/main.js'
import Admin from './components/admin.js'

class App extends React.Component {

  render() {
    return (
      <>
        <Router>
          <Routes>
            <Route path={"/"} element={<Main />}></Route>
            <Route path={"/admin"} element={<Admin />}></Route>
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
          </Routes>
        </Router>
      </>
    )
  }
}


export default App;
