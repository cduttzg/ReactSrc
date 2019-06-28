import React from 'react';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Checkbox,
  Button
} from 'antd';
import '../stylesheets/DrawerRegisterForm.css'

export default class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    registerButtonDisable : true 
  };

  handleSubmit = e => {
    e.preventDefault();
    const register = this.props['handleRegister'];
    this.props['form'].validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const url = '/api/user/register';
        const data = {"学号":1,"用户名":values.nickname,"密码":btoa(values.password_1),
                      "教务处密码":values.password_2,"手机号":values.phone,"邮箱":values.email,
                      "地址":values.address};
        
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props['form'];
    if (value && value !== form.getFieldValue('password_1')) {
      callback('两次输入的密码不一致！');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props['form'];
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props['form'];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="电子邮箱">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: '输入的邮箱格式不规范！',
              },
              {
                required: true,
                message: '请输入你的电子邮箱！',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="密码" hasFeedback>
          {getFieldDecorator('password_1', {
            rules: [
              {
                required: true,
                message: '请输入你的密码！',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="确认密码" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请确认你输入的密码！',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item label="用于验证身份的教务处密码" hasFeedback>
          {getFieldDecorator('password_2', {
            rules: [
              {
                required: true,
                message: '请输入你的教务处密码！',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              用户名&nbsp;
              <Tooltip title="请输入你的用户名">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: '请输入你的用户名！', whitespace: true }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="电话号码">
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入你的电话号码！' }],
          })(<Input style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox onChange={()=>{
              this.setState({
                registerButtonDisable : !this.state.registerButtonDisable
              })
            }}>
              我已经阅读并同意 <a href="seefun.club">用户协议</a>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item
          label={
            <span>
              收货地址&nbsp;
              <Tooltip title="请输入你的收货地址">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('address', {
            rules: [{ required: true, message: '请输入你的收货地址！', whitespace: true }],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button disabled={this.state.registerButtonDisable} type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    );
  }
}