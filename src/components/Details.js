import React,{Component} from 'react'
import { Link} from 'react-router-dom'
import { Layout, Breadcrumb, Card, Avatar, Col, Row, Button, Modal, message, Icon } from 'antd'
import '../stylesheets/Details.css'
import { Post, Get } from '../utils/Request';

export default class Details extends Component{
    constructor(props){
        super(props);
        let goods = this.props['location'].state;
        console.log('进入Details了！');
        console.log(goods);
        let username = window.sessionStorage.getItem('username');
        console.log(username)
        console.log(window.sessionStorage);
        this.state={
            //接收参数1
            sellerName:"",
            sellerAvatar:"",
            sellerSoldNum: 0,
            sellerPaymentCode: "",
            terminalPay:1,
            orderId: "",
            buySuccess: 0,
            cartSuccess: 0,
            //维护状态
            userName:username,
            btnDisable1: false,
            btnDisable2: false,
            loading:false,
            goodsNum:1,
            visible: false,
            add:false,
            //接收参数2
            goodsId:goods.goodsId,
            goodsName:goods.goodsName,
            goodsImg:goods.goodsImg,
            goodsInfo:goods.goodsInfo,
            goodsPrice:goods.goodsPrice,
            sellerPhoneNum:goods.sellerPhoneNum,
            goodsStock:goods.goodsStock,
        }
        this.numChange1=this.numChange1.bind(this);
        this.numChange2=this.numChange2.bind(this);
    }

    numChange1(){
        if(this.state['goodsNum']===1){
            this.setState({
                btnDisable1: true,
                btnDisable2: false,
                goodsNum: --this.state['goodsNum'],
            })
        }else{
            this.setState({
                btnDisable1: false,
                btnDisable2: false,
                goodsNum: --this.state['goodsNum'],
            })
        }
        
    }

    numChange2(){
        if(this.state['goodsNum']===this.state['goodsStock']-1){
            this.setState({
                goodsNum: ++this.state['goodsNum'],
                btnDisable2: true,
                btnDisable1: false
            })
        }else{
            this.setState({
                goodsNum: ++this.state['goodsNum'],
                btnDisable1: false,
                btnDisable2: false
            })
        }
    }

    enterLoading = () => {
        if(this.state['goodsNum']==0){
            message.error('商品数量为0...你到底买不买啊!(｡•ˇ‸ˇ•｡)',2.5);
        }else{
            this.setState({ loading: true});
        
            setTimeout(() => {
              this.setState({
                loading: false,
                visible: true 
              });
            }, 500);
        }
    };
    //创建订单
    handleCreateOrder = (username, goodsId, goodsNum) =>{
        const globalMessage = message;
        let url = '/api/goods/buyNow';
        let data = {
            '用户名':username,
            '商品ID':goodsId,
            '数量':goodsNum
        }
        let res = Post(url, data);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){
                globalMessage.warn(message);
            }else{
                let userData = data["卖家信息"];
                //获取数据成功
                this.setState({
                    sellerPaymentCode: userData["收款码"],
                    terminalPay:userData["金钱"],
                    orderId: data["订单ID"],
                    buySuccess: code,
                });
                globalMessage.success('购买成功！');
            }
        });
    }
    componentDidMount(){
    }
    handleAddGoodsToCart = (username, goodsId, goodsNum) =>{
        const globalMessage = message;
        let url = '/api/goods/addToCart';
        let data = {
            '用户名':username,
            '商品ID':goodsId,
            '商品数量':goodsNum
        }
        let res = Post(url, data);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){
                globalMessage.error(message);
            }else{
                //添加商品进入购物车成功
                this.setState({
                    cartSuccess : code
                });
                this.componentDidMount();
                globalMessage.loading("正在提交...", 0.5).then(() => globalMessage.success('已成功添加到购物车,快去购物车看看宝贝吧~(っ ̯ -｡) '),undefined);
            }
        }); 
    }
    //点击OK
    handleOk = e => {
        //console.log(e);
        if(this.state['goodsNum']==0){
            message.error('商品数量为0,你到底买不买啊!(｡•ˇ‸ˇ•｡)',2.5);
        }else{
            //需要调用创建订单的API
            this.handleCreateOrder(this.state['userName'],this.state['goodsId'],this.state['goodsNum']);
            //this.state['buySuccess']===200?message.loading("正在提交...", 0.5).then(()=>{message.success('您已经完成支付! 卖家会在24小时内尽快联系您๑乛◡乛๑',2.5)}) : message.loading("正在提交...",0.5).then(()=>message.error('很抱歉,创建订单失败!我们将尽快进行处理!!!∑(ﾟДﾟノ)ノ',2.0));
            this.setState({
                visible: false,
            });
        }
    };

    //点击取消
    handleCancel = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
    };


    
    //添加商品至购物车
    addGoods = e => {
        console.log("进入到添加商品到购物车!")
        if(this.state['goodsNum']==0){
            message.error('商品数量为0...你到底买不买啊!(｡•ˇ‸ˇ•｡)',2.5);
        }else{
            //调用添加商品到购物车的API
            this.handleAddGoodsToCart(this.state['userName'],this.state['goodsId'],this.state['goodsNum']);
           // this.state['cartSuccess']===200?message.loading("正在提交...",0.5).then(()=>message.success('已成功添加到购物车,快去购物车看看宝贝吧~(っ ̯ -｡) ',2.5)) : message.loading("正在提交...",0.5).then(()=>message.error('添加到购物车失败！我们记录错误并尽快解决问题!!!∑(ﾟДﾟノ)ノ',2.5));
        }
    }
    componentWillMount(){
        const globalMessage = message;
        let url = `/api/goods/getInfo?商品ID=${this.state['goodsId']}`;
        let res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){
                globalMessage.warn(message);
            }else{
                //获取卖家信息成功
                this.setState({
                    sellerName:data['卖家名称'],
                    sellerAvatar:data['卖家头像'],
                    sellerSoldNum: data['卖家成功交易量'],
                    sellerPaymentCode : data['收款码']
                });
            }
        });
    }
    render(){
        const { Meta } = Card;
        const ButtonGroup = Button.Group;
        const { Header, Content, Footer , Sider } = Layout;

        console.log('立即购买！');
        console.log(this.state);
        return(
            <div id='details'>
                <Layout className="Layout-Jankin">
                <Content style={{ padding: '0 50px' }}>
                        <Breadcrumb separator=">"style={{ margin: '16px 0' }}>
                        <Link to="/home"><Breadcrumb.Item>首页</Breadcrumb.Item></Link>
                            <Link to={{
                                pathname:'/goods/gallery',
                                state:{tag:this.props.location.state.tag}
                            }}><Breadcrumb.Item>{this.props.location.state.tag}</Breadcrumb.Item></Link>
                            <Breadcrumb.Item>{this.state['goodsName']}</Breadcrumb.Item>
                        </Breadcrumb>
                    <div className="main" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <Layout>
                            <Layout>
                                <Sider className="Sider-Jankin" id="goodsImg"><div><img className='sider-goodsImg-Jankin' src={this.state['goodsImg']} alt={this.state['goodsName']}></img></div></Sider>
                                <Layout>
                                    <Content>
                                        <div id="goodsInfo">
                                            <Card title={this.state['goodsName']} style={{ marginTop: 16 , textAlign: "center"}}>
                                                <Card type="inner" bordered={false} title="商品描述" style={{ marginTop: 16 , textAlign: "center"}}>
                                                    {this.state['goodsInfo']}
                                                </Card>
                                                <Card
                                                    bordered={false}
                                                    style={{ marginTop: 16 , textAlign: "center"}}
                                                    type="inner"
                                                    title="卖家信息"
                                                >
                                                    <Row>
                                                        <Col span={8}>
                                                            <Card hoverable bordered={false}>
                                                            <Avatar src={this.state['sellerAvatar']} ></Avatar>
                                                                <span
                                                                    style={{
                                                                    fontSize: 14,
                                                                    color: 'rgba(0, 0, 0, 0.85)',
                                                                    marginBottom: 16,
                                                                    fontWeight: 500,
                                                                    }}
                                                                >
                                                                    {this.state['sellerName']}
                                                                </span>
                                                                    <p>联系方式:<span>{this.state['sellerPhoneNum']}</span></p>
                                                            </Card>
                                                        </Col>
                                                        <Col span={8} offset={8}>
                                                            <Card className="infoContent" bordered={false}>
                                                                已成功交易量:{this.state['sellerSoldNum']}
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Card>
                                        </div>
                                    </Content>
                                </Layout>
                            </Layout>
                            <Footer>
                                <div id="goodsOperators">
                                    <Row type="flex" justify="space-around" align="middle">
                                        <Col span={4}>
                                            <div className="OperatorsBox">
                                                
                                                <ButtonGroup>
                                                    <div id="numChange">
                                
                                                        <Button className='btn-Jankin' disabled={this.state['btnDisable1']} type="primary" icon="minus" onClick={this.numChange1}/>
                                                        <span className='span-Jankin'>{this.state['goodsNum']}</span>
                                                        <Button className='btn-Jankin' disabled={this.state['btnDisable2']} type="primary" icon="plus" onClick={this.numChange2}/>
                                                    </div>
                                                </ButtonGroup>
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className="OperatorsBox">
                                                <span>￥{this.state['goodsNum']*this.state['goodsPrice']}</span>
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className="OperatorsBox">
                                            <Button type="primary" shape="round" icon="shopping-cart" size="default" onClick={this.addGoods}>
                                                添加至购物车
                                            </Button>
                                            </div>
                                        </Col>
                                        <Col span={3}>
                                            <div className="OperatorsBox">
                                                <Button type="primary" shape="round" icon="pay-circle" size="default" loading={this.state['loading']} onClick={this.enterLoading}>
                                                    立即购买
                                                </Button>
                                                <Modal
                                                    title="付款窗口"
                                                    visible={this.state['visible']}
                                                    onOk={this.handleOk}
                                                    onCancel={this.handleCancel}
                                                >
                                                    <Card
                                                        style={{ width: '100%'}}
                                                        cover={
                                                        <img className="moneyCode-img-c1er"
                                                            alt="付款码"
                                                            src={this.state['sellerPaymentCode']}
                                                        />
                                                        }
                                                        actions={[<img className='goods-img-c1er' src={this.state['goodsImg']} alt={this.state['goodsName']} />,<span><Icon type="pay-circle" />{this.state['goodsNum']*this.state['goodsPrice']}元</span>,<span>{this.state['terminalPay']}</span>]}
                                                    >
                                                        <Meta
                                                        avatar={/*卖家头像 */<Avatar src={this.state['sellerAvatar']} />}
                                                        title={this.state['sellerName']}
                                                        description={this.state["goodsName"]}
                                                        />
                                                    </Card>
                                                </Modal>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Footer>
                        </Layout>
                    </div>
                </Content>
            </Layout>
            </div>
        )

    }

}