import { Layout, Menu, Input, Avatar, Modal, Button, Form, Drawer, Dropdown } from 'antd';
import React,{Component} from 'react';
import LoginForm from './LoginForm';
import DrawerRegisterForm from './DrawerRegisterForm';
import '../stylesheets/TopHeader.css';

const { Header } = Layout;
const { Search } = Input;

export default class TopHeader extends Component{
    constructor(props){
        super(props);
        this.state={
            user : {
                role : 0,
                username : '',
                isLogin : false,
                avatarSrc : null,
                isFrozen : false
            },
            modal : {
                modalText : '',
                visible : false
            },
            drawer : {
                drawerText : '',
                visible : false
            }
        }
    }
    componentDidMount(){
        
    }
    render(){
        let user = this.state['user'], modal = this.state['modal'], drawer = this.state['drawer'];
        const WrappedLoginForm = Form.create({ name: 'normal_login' })(LoginForm);
        const WrappedRegisterForm = Form.create({ name: 'register' })(DrawerRegisterForm);
        const avatarMenu = (
            <Menu>
                <Menu.Item key='0'>
                    <a href='seefun.club'>个人信息管理</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='1'>
                    <a href='seefun.club'>个人中心</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='2'>
                    <a href='seefun.club'>退出登陆</a>
                </Menu.Item>
            </Menu>
        );
        return(
            <div id='header'>
                <Header id="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" />
                        <div className="siteName">贝壳</div>
                        {!user['isLogin'] ? <Avatar className='userAvatar' size={40} icon="user" /> : <Dropdown overlay={avatarMenu} trigger={['click']}><Avatar className='userAvatar' size={40} src={user['avatarSrc']} /></Dropdown>}
                        {!user['isLogin'] ? <div className='register'>
                            <Button onClick={this.handleRegisterClick}>注册</Button>
                            <Drawer 
                                title='注册属于你的账户' 
                                width={700} 
                                onClose={this.handleRegisterModalCancle} 
                                visible={drawer.visible}>
                                <WrappedRegisterForm handleRegister={this.handleRegisterSubmit} />
                            </Drawer>
                            </div> : null }
                        {!user['isLogin'] ? <div className='login'>
                            <Button onClick={this.handleLoginClick}>登陆</Button>
                            <Modal visible={modal.visible} footer={null} onCancel={this.handleLoginModalCancle} title='登陆'>
                                <WrappedLoginForm handleSubmit={this.handleLoginFormSubmit} />
                            </Modal>
                            </div> : null }
                    <div className="forSearch">
                        <Search placeholder='输入你想查找的物品名称' onSearch={value=>{console.log(value)}} enterButton ></Search>
                    </div>
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                    >
                    <Menu.Item key="1">首页</Menu.Item>
                    <Menu.Item key="2">福利</Menu.Item>
                    {user['role'] === 1 || user['role'] === 2 ? <Menu.Item key="3">后台管理</Menu.Item> : null}          
                    </Menu>
                </Header>
            </div>
        );
    }
    //点击登陆按钮，使得弹窗显示
    handleLoginClick = () => {
        this.setState({
            modal : {
                visible : true
            }
        });
    };
    handleRegisterClick = () => {
        this.setState({
            drawer : {
                visible : true
            }
        });
    }
    handleLoginModalCancle = () => {
        this.setState({
            modal : {
                visible : false
            }
        });
    };
    handleRegisterModalCancle = () =>{
        this.setState({
            drawer : {
                visible : false
            }
        });
    };
    //resolve login event
    handleLoginFormSubmit = (user) => {
        console.log(user);
        this.setState({
            user : user
        })
    }
    //resolve the register event
    handleRegisterSubmit = (user) => {
        console.log(user);
        this.setState({
            user : user
        })
    }
}