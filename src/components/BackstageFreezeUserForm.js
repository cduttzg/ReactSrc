import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Post } from '../utils/Request';

export default class BackstageFreezeUserForm extends React.Component{
    handleSubmit = e =>{
        e.preventDefault();
        this.props['form'].validateFields((err, values) =>{
            if(!err){
                console.log('Received values of form: ', values);
                const globalMessage = message;
                let url = '/api/backstage/freezeUser';
                let data = {
                    '用户学号' : values.freezeUserSchoolCardNumber
                }
                let res = Post(url, data);
                res.then(response=>{
                    let {code, message, data} = response;
                    if(code!==200){globalMessage.error(message)}
                    else{
                        globalMessage.success('冻结用户成功！');
                        //刷新组件
                        this.props.handleFreezeUser();
                    }
                });
            }
        });
    }
    render(){
        const { getFieldDecorator } = this.props['form'];
        return(
            <Form onSubmit={this.handleSubmit} className='addAdminForm-c1er'>
                <Form.Item>
                    {getFieldDecorator('freezeUserSchoolCardNumber',{
                        rules : [{ max:12,required: true, message: '请正确的输入用户的学号，最长为12位' }]
                    })(<Input placeholder='用户学号' />)}
                </Form.Item>
                <Form.Item>
                    <Button type='danger' htmlType="submit" className="login-form-button">冻结用户</Button>
                </Form.Item>
            </Form>
        );
    }
}