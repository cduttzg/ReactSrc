import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import '../stylesheets/LoginForm.css';
import { Post } from '../utils/Request';

export default class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const golbalMessage = message;
    const submit = this.props['handleSubmit'];
    this.props['form'].validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const url = '/api/user/login';
        const data = {"用户名" : values.username, "密码" : btoa(values.password)};
        const res = Post(url, data);
        res.then(response => {
          let {code, message, data} = response;
          if(code !== 200) {golbalMessage.error(message)}
          //c1er:7/4这里做出了改动：将外部代码引入到else块里
          else{
            const user = {
              username : values.username,
              isFrozen : data['是否被冻结'],
              role : data['角色'],
              isLogin : true,
              userAvatarSrc : data['用户头像']
            };
  
            golbalMessage.success('登陆成功！');
            submit(user);
            //remember the password
            if(values.remember){
              let storage = window.localStorage;
              storage.clear();
              storage.setItem('password',btoa(values.password));
              storage.setItem('username',values.username);
              console.log('登陆成功，设置localStorage');
              console.log(storage);
            }
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props['form'];
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入你的用户名！' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入你的密码！' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="你的密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住密码</Checkbox>)}
          <a className="login-form-forgot" href="seefun.club">
              忘记密码
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button" >
              登陆
          </Button>
          或者&nbsp;&nbsp;点击注册按钮去注册一个？
        </Form.Item>
      </Form>
    );
  }
}