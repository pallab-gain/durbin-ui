import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {About} from "./components/about";
import {Home} from './components/home';
import {NotFound404} from "./components/NotFound404";

const App = () => {
    return (
        <Router>
            <>
                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/about" exact={true}><About/></Route>
                    <Route path="/" exact={true}><Home/></Route>
                    <Route path="*"><NotFound404/></Route>
                </Switch>
            </>
        </Router>
    );
}

export default App;
