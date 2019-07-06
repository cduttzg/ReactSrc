import React,{Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import TopHeader from './TopHeader';
import Home from './Home';
import UserMessage from './UserMessage';
import UserHome from './UserHome';
import Details from './Details';
import GoodsGallery from './GoodsGallery';
import ShowCart from './ShowCart';
import Backstage from './Backstage';
import '../stylesheets/App.css';

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
                <Route exact path='/home' component={Home} />
                <Route exact path='/backstage' component={Backstage} />
                <Route exact path='/users/home' component={UserHome} />
                <Route exact path='/users/message' component={UserMessage} />
                <Route exact path='/goods/gallery' component={GoodsGallery} />
                <Route exact path='/goods/details' component={Details} />
                <Route exact path='/cart/details' component={ShowCart} />
            </Router>
        );
    }
}