import React,{Component} from 'react';
import { Post } from '../utils/Request';
import AllUserOrders from './AllUserOrders';
import AboutSeller from './AboutSeller';
import UserSeekInfo from './UserSeekInfo';
import '../stylesheets/UserHome.css';
import { Divider } from 'antd';

export default class UserHome extends Component{
    constructor(props){
        super(props);
        console.log(this.props['location'].state);
        let {username} = this.props['location'].state || {username : 1}
        this.state={
            username : username,
            isSeller: true
        }
    }
    componentWillMount(){
        let url = '/api/user/home/isSeller';
        let data = {'用户名':this.state['username']}
        let res = Post(url, data);
        res.then(response=>{
            const {code, message, data} = response;
            this.setState({
                isSeller : data.isSaller
            })
        });
    }
    render(){
        return(
            <div id='userHome'>
                <Divider>历史订单</Divider>
                <AllUserOrders user={this.state} />
                <Divider>已发布求购</Divider>
                <UserSeekInfo user={this.state} />
                {this.state.isSeller ? <AboutSeller user={this.state} /> : null}
            </div>
        );
    }
}