import React from "react";
import { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {connect} from "react-redux";
import { UserSelector } from "./selectors/user";
import Header from "./components/Header";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import MoviePage from "./pages/MoviePage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Auth from "./pages/Auth";
import Sign from "./pages/Sign";
import Remind from "./pages/Remind";
import Restore from "./pages/Restore";

const App = ({user})  => {


    if (user.auth) return (
    <div className="App m-0 p-0" >
        <Router>
            <Header/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/search" component={SearchPage}/>
                <Route path="/profile" component={Profile}/>
                <Route path="/movie/" component={MoviePage}/>
                <Route path="/edit_profile" component={EditProfile}/>
            </Switch>
        </Router>
    </div>
  )
    else
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Auth}/>
                    <Route path="/sign" component={Sign}/>
                    <Route path="/remind" component={Remind}/>
                    <Route path="/restore" component={Restore}/>
                </Switch>
            </Router>
        )
}
const mapStateToProps = (state) => ({
    user: UserSelector(state)
})
export default connect(mapStateToProps)(App);
