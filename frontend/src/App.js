import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import CoffeeMain from './components/CoffeeMain.js'
import CoffeeAdmin from './components/CoffeeAdmin.js'

class App extends React.Component {

  render() {
    return (
      <>
        <Router>
          <Routes>
            <Route path={"/"} element={<CoffeeMain />}></Route>
            <Route path={"/admin"} element={<CoffeeAdmin />}></Route>
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
