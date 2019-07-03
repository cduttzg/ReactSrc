import React,{Component} from 'react'
import {BrowserRouter as Router, Link} from 'react-router-dom'
import { Layout, Breadcrumb, Card, Avatar, Col, Row, Button, Modal, Icon, message } from 'antd'
import '../styleSheets/Details.css'
import { thisExpression } from '@babel/types';
import { relative } from 'path';

export default class Details extends Component{
    constructor(props){
        super(props);
        this.state={
            sellerName:"灰太狼",
            sellerAvatar:"xxx",
            sellerSoldNum: 999,
            sellerPaymentCode: "ooo",
            btnDisable1: false,
            btnDisable2: false,
            loading:false,
            goodsId:"007",
            goodsName:"小红的帽子",
            goodsImg:"adsad",
            goodsInfo:"陪伴小红经历种种磨难却任然坚挺的帽子!",
            goodsPrice:88,
            sellerPhoneNum:"17766377737",
            goodsNum:1,
            goodsStock:10,
            visible: false,
            success: false
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

    //点击OK
    handleOk = e => {
        console.log(e);
        if(this.state['goodsNum']==0){
            message.error('商品数量为0,你到底买不买啊!(｡•ˇ‸ˇ•｡)',2.5);
        }else{
            this.state['success']?message.loading("正在提交...",0.5).then(()=>message.success('您已经完成支付! 卖家会在24小时内尽快联系您๑乛◡乛๑',2.5)):message.loading("正在提交...",0.5).then(()=>message.error('很抱歉,创建订单失败!我们将尽快进行处理!!!∑(ﾟДﾟノ)ノ',2.0));
            //需要调用创建订单的API

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


    onChange(a, b, c) {
        console.log(a, b, c);
    }
    
    //添加商品至购物车
    addGoods = e => {
        if(this.state['goodsNum']==0){
            message.error('商品数量为0...你到底买不买啊!(｡•ˇ‸ˇ•｡)',2.5);
        }else{
            //调用添加商品到购物车的API
            this.state['success']?message.loading("正在提交...",0.5).then(()=>message.success('已成功添加到购物车,快去购物车看看宝贝吧~(っ ̯ -｡) ',2.5)):message.loading("正在提交...",0.5).then(()=>message.error('添加到购物车失败！我们记录错误并尽快解决问题!!!∑(ﾟДﾟノ)ノ',2.5));
        }
        
    }

    render(){
        const { Meta } = Card;
        const ButtonGroup = Button.Group;
        const post = {//this.props.locations.state.
            goodsId:"007",
            goodsName:"小红的帽子",
            goodsInfo:"陪伴小红经历种种磨难却任然坚挺的帽子!",
            goodsPrice:88,
            sellerPhoneNum:"17766377737",
            goodsNum:1,
            goodsStock:233,

        }
        const { Header, Content, Footer , Sider } = Layout;
        return(
            <Layout className="Layout-Jankin">
                <Header>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Router>
                        <Breadcrumb separator=">"style={{ margin: '16px 0' }}>
                            <Link to=""><Breadcrumb.Item>首页</Breadcrumb.Item></Link>
                            <Link to=""><Breadcrumb.Item>分类名</Breadcrumb.Item></Link>
                            <Breadcrumb.Item>{this.state['goodsName']}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Router>
                    <div className="main" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <Layout>
                            <Layout>
                                <Sider className="Sider-Jankin" id="goodsImg"><div><img src="" alt=""></img></div></Sider>
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
                                                            <Avatar ></Avatar>
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
                                                                    <p>联系方式:<p>{this.state['sellerPhoneNum']}</p></p>
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
                                        <Col span={2}>
                                            <div className="OperatorsBox">
                                            <Button type="primary" shape="round" icon="shopping-cart" size="large" onClick={this.addGoods}>
                                                添加至购物车
                                            </Button>
                                            </div>
                                        </Col>
                                        <Col span={3}>
                                            <div className="OperatorsBox">
                                                <Button type="primary" shape="round" icon="pay-circle" size="large" loading={this.state['loading']} onClick={this.enterLoading}>
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
                                                        <img
                                                            alt="付款码"
                                                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"//this.state.sellerPaymentCode
                                                        />
                                                        }
                                                        actions={[<img src={this.state['goosImg']} alt={this.state['goodsName']} />]}
                                                    >
                                                        <Meta
                                                        avatar={/*卖家头像 */<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
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
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        )

    }

}
{/**/}
