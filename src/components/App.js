import React,{Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import '../stylesheets/App.css';
import TopHeader from './TopHeader';
import Home from './Home';


export default class App extends Component{
    //全局数据源
    constructor(props){
        super(props);
        this.state={
            user : {
                name : '张山',
                role : 0,
                ifLogin : false,
            },

        };
    }
    render(){
        return(
            <Router>
                <Route path='/' component={TopHeader} />
                <Switch>
                    <Route path='/homePage' component={Home} />
                </Switch>
            </Router>
        );
    }
}