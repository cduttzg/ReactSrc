import { Layout, Menu, Input, Avatar, Modal, Button, Form, Drawer, Dropdown, message, notification, List  } from 'antd';
import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import LoginForm from './LoginForm';
import DrawerRegisterForm from './DrawerRegisterForm';
import '../stylesheets/TopHeader.css';
import { Get } from '../utils/Request';

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
                userAvatarSrc : null,
                isFrozen : false
            },
            modal : {
                modalText : '',
                visible : false
            },
            drawer : {
                drawerText : '',
                visible : false
            },
            cart : {
                visible : false
            },
            searchGoods : []
        }
    }
    componentDidMount(){
        //localstorage judge
        let storage = window.localStorage;
        console.log(storage);

        if(storage.getItem('password')){
            //let data = (new Date).getTime;
            //if last for more than one day
            const userOld = this.state['user'];
            userOld.username = storage.getItem('username');
            this.setState({
                user : userOld
            })
            window.sessionStorage.setItem('username',this.state['user'].username || storage.getItem('username'));
            // this.setState({
            //     user : {
            //         username : storage.getItem('username'),
            //         isLogin : true
            //     }
            // })
            this.handleGetUserInfo();
            console.log(this.state);
            // //-------
            // if(Number(data) - Number.parseInt(storage.getItem('time')) > 480000000){
            //     storage.clear();
            // }else{
            //     //将用户名添加到sessionStorage
            // }
        }
        console.log('TopHeader的component: state:');
        console.log(this.state)
    }
    handleGetUserInfo = () =>{
        console.log('handleGetUserInfo--->state:');
        console.log(this.state)
        //每次进入首页重新获取用户信息
        if(this.state['user'].isLogin){
            const globalMessage = message;
            let url = `/api/user/home/message?用户名=${this.state['user'].username}`;
            const res = Get(url); 
            res.then(response=>{
                let {code, message, data} = response;
                if(code!==200){globalMessage.error(`拉取用户个人信息失败！+${message}`)}
                else{
                    this.setState({
                        user : {
                            userAvatarSrc : data['用户头像'],
                            email : data['电子邮箱'],
                            username : data['用户名'],
                            phone : data['手机号码'],
                            address : data['收货地址'],
                            moneyCode : data['收款码'],
                            isLogin : true,
                            role : data['角色'],
                            isFrozen : data['是否被冻结']
                        }
                    });
                }
            });
        }
    }
    //商品搜索框
    handleSearch = value =>{
        let url = `/api/goods/findGoods?物品名称=${value}`;
        let res = Get(url);
        const globalMessage = message;
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){globalMessage.error(message)}
            else{
                this.setState({
                    searchGoods : data
                });
            }
        });
    }
    render(){
        let user = this.state['user'], modal = this.state['modal'], drawer = this.state['drawer'];
        const WrappedLoginForm = Form.create({ name: 'normal_login' })(LoginForm);
        const WrappedRegisterForm = Form.create({ name: 'register' })(DrawerRegisterForm);
        const avatarMenu = (
            <Menu>
                <Menu.Item key='0' disabled={this.state['user'].isFrozen}>
                    <Link to={{
                        pathname: this.state['user'].isFrozen ? '' : '/users/message',
                        state: {username: this.state['user'].username}
                    }}>个人信息管理</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='1' disabled={this.state['user'].isFrozen}>
                    <Link to={{
                        pathname : this.state['user'].isFrozen ? '' : '/users/home',
                        state: {username: this.state['user'].username }
                    }}>个人中心</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='2' onClick={()=>{
                    this.setState({
                        user : {
                            username : '',
                            isLogin : false
                        },
                        modal : {
                            modalText : '',
                            visible : false
                        },
                        drawer : {
                            drawerText : '',
                            visible : false
                        }
                    });
                    //页面跳转
                    let session = window.sessionStorage;
                    session.clear();
                    this.props['history'].push('/home');
                }}>退出登陆
                </Menu.Item>
            </Menu>
        );
        return(
            
            <div id='header'>
                {this.state['user'].isFrozen ? notification['error']({
                    message : '账户已被冻结',
                    description : '由于做出了某些违反社区规定的行为，你的账号已被社区管理员冻结，使用邮件联系管理员：kexiezhang@gmail.com'
                }) : null }
                <Header id="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" />
                        <div className="siteName">贝壳</div>
                        {!user['isLogin'] ? <Avatar className='userAvatar' size={40} icon="user" /> : <Dropdown overlay={avatarMenu} trigger={['click']}><Avatar className='userAvatar' size={40} src={this.state['user']['userAvatarSrc']} /></Dropdown>}
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
                            <Modal visible={modal.visible} style={{marginTop:100}} footer={null} onCancel={this.handleLoginModalCancle} title='登陆'>
                                <WrappedLoginForm handleSubmit={this.handleLoginFormSubmit} />
                            </Modal>
                            </div> : null }
                    <div className="forSearch">
                        <Search placeholder='输入你想查找的物品名称' onBlur={()=>{
                            setTimeout(()=>{
                                this.setState({
                                    searchGoods : []
                                });
                                console.log('blur事件触发了！')
                            },500);
                        }} onSearch={value=>{this.handleSearch(value)}} enterButton ></Search>
                        {this.state['searchGoods'].length>=1?<List bordered dataSource={this.state['searchGoods']}
                        renderItem={item=>(
                            <List.Item style={{height:25,backgroundColor:'#f5f5f5'}}>
                                <Link to={{
                                    pathname : '/goods/details',
                                    state : {
                                        goodsId : item['商品ID'],
                                        goodsName: item['商品名称'],
                                        goodsImg : item['商品图片'],
                                        goodsInfo : item['描述'],
                                        goodsPrice : item['单价'],
                                        goodsStock:item['数量'],
                                        sellerId : item['卖家ID'],
                                        sellerPhoneNum : item['联系方式'],
                                        tag: item['商品类型']
                                    }
                                }}>{item['商品名称']}</Link>
                            </List.Item>
                        )} />:null}

                    </div>
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1" onClick={()=>{this.handleGetUserInfo()}}><Link to='/home'>首页</Link></Menu.Item>
                        <Menu.Item key="2"><Link to={{
                            pathname : '/goods/gallery',
                            state : {tag: '求购'}
                        }}>求购</Link></Menu.Item>
                        {this.state['user'].role >= 1 ? <Menu.Item key="3"><Link to={{
                            pathname : '/backstage',
                            state : {role: this.state['user'].role}
                        }}>后台管理</Link></Menu.Item> : null}          
                    </Menu>
                </Header>
                {(this.state.user.isLogin&&this.state.cart.visible&&!this.state['user'].isFrozen)?<Cart username={this.state.user.username} />:null}
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
        console.log('登陆之后：')
        console.log(user);
        const cart = this.state.cart;
        cart.visible=true;
        this.setState({
            user : user,
            cart : cart
        })
        let session = window.sessionStorage;
        session.setItem('username',this.state.user.username);
        console.log('handleLoginFormSubmit');
        console.log(this.state);
        //
    }
    //resolve the register event
    handleRegisterSubmit = (user) => {
        console.log('handleRegisterSubmit');
        console.log(user);
        const cart = this.state.cart;
        cart.visible=true;
        this.setState({
            user : user,
            cart : cart
        })
        let session = window.sessionStorage;
        session.setItem('username',this.state.user.username);
    }
}