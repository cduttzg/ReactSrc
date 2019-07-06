import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Post } from '../utils/Request';

export default class BackstageMangeOrderForm extends React.Component{
    handleSubmit = e =>{
        e.preventDefault();
        this.props['form'].validateFields((err, values) =>{
            if(!err){
                console.log('Received values of form: ', values);
                const globalMessage = message;
                let url = '/api/backstage/manageOrder';
                let data = {
                    '订单ID' : values.orderId
                }
                let res = Post(url, data);
                res.then(response=>{
                    let {code, message, data} = response;
                    if(code!==200){globalMessage.error(message)}
                    else{
                        globalMessage.success('订单置为异常状态成功！');
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
                    {getFieldDecorator('orderId',{
                        rules : [{ required: true, message: '请输入订单ID' }]
                    })(<Input placeholder='订单ID' />)}
                </Form.Item>
                <Form.Item>
                    <Button type='danger' htmlType="submit" className="login-form-button">置为异常</Button>
                </Form.Item>
            </Form>
        );
    }
}