import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Home from "./pages/Home";
import User from "./pages/User";
import SearchPage from "./pages/SearchPage";
import Header from "./components/Header";
import {connect} from "react-redux";
import { UserSelector } from "./selectors/user";
import AuthPage from "./pages/AuthPage";
import MoviePage from "./pages/MoviePage";

const App = ({user})  => {
    if (user.auth) return (
    <div className="App m-0 p-0" >
        <Router>
            <Header/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/search" component={SearchPage}/>
                <Route path="/user" component={User}/>
                <Route path="/movie/" component={MoviePage}/>
            </Switch>
        </Router>
    </div>
  )
    else
        return (
            <AuthPage />
        )
}
const mapStateToProps = (state) => ({
    user: UserSelector(state)
})
export default connect(mapStateToProps)(App);
