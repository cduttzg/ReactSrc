import React, { Component } from 'react';
import { Form } from 'antd';
import UpdateMessageForm from './UpdateMessageForm';
import '../stylesheets/UserMessage.css';
import { Get } from '../utils/Request';

export default class UserMessage extends Component{
    constructor(props){
        super(props);
        console.log(this.props['location'].state);
        let {username} = this.props['location'].state
        this.state={
            user : {
                username : username
            }
        };
    }
    componentDidMount(){
        let url = `/api/user/home/message?用户名=${this.state['user'].username}`;
        const res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            this.setState({
                user : {
                    userAvatarSrc : data['用户头像'],
                    email : data['电子邮箱'],
                    username : data['用户名'],
                    phone : data['手机号码'],
                    address : data['收货地址'],
                    moneyCode : data['收款码']
                }
            });
        });
    }
    render(){
        console.log('userMessage.js');
        const WrappedUpdateForm = Form.create({ name: 'updateMessage' })(UpdateMessageForm);
        return(<div id='userMessage'>
            <WrappedUpdateForm user={this.state['user']} />
        </div>);
    }
}