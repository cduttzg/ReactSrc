import React,{Component} from 'react'
import {BrowserRouter as Router, Link} from 'react-router-dom'
import { Layout, Breadcrumb, Card, Avatar, Col, Row, Button } from 'antd'
import '../styleSheets/Details.css'

export default class Details extends Component{
    constructor(props){
        super(props);
        this.state={
            sellerName:"灰太狼",
            sellerAvatar:"xxx",
            sellerSoldNum: 999,
            sellerPhoneNum:"17766377737",
            goodsNum:1,
            goodsStock:233,
            btnDisable: false
        }
        this.numChange1=this.numChange1.bind(this);
        this.numChange2=this.numChange2.bind(this);
    }

    numChange1(){
        if(this.state['goodsNum']===1){
            this.setState({
                btnDisable: true,
                goodsNum: --this.state['goodsNum'],
            })
        }else{
            this.setState({
                btnDisable: false,
                goodsNum: --this.state['goodsNum'],
            })
        }
        
    }

    numChange2(){
        if(this.state['goodsNum']===this.state['goodsStock']){
            this.setState({
                btnDisable: true
            })
        }else{
            this.setState({
                goodsNum: ++this.state['goodsNum'],
                btnDisable: false
            })
        }
    }
    
    render(){
        
        const ButtonGroup = Button.Group;
        const post = {//this.props;
            goodsName:"小红的帽子",
            goodsInfo:"陪伴小红经历种种磨难却任然坚挺的帽子!",

        }
        const { Header, Content, Footer , Sider } = Layout;
        return(
            <Layout className="Layout-Jankin">
                <Header>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Router>
                        <Breadcrumb separator=">"style={{ margin: '16px 0' }}>
                            <Link to=""><Breadcrumb.Item>首页a</Breadcrumb.Item></Link>
                            <Link to=""><Breadcrumb.Item>分类名</Breadcrumb.Item></Link>
                            <Breadcrumb.Item>商品名</Breadcrumb.Item>
                        </Breadcrumb>
                    </Router>
                    <div className="main" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <Layout>
                            <Layout>
                                <Sider className="Sider-Jankin" id="goodsImg"><div><img src="" alt=""></img></div></Sider>
                                <Layout>
                                    <Content>
                                        <div id="goodsInfo">
                                            <Card title={post.goodsName}>
                                                <Card type="inner" bordered={false} title="商品描述">
                                                    {post.goodsInfo}
                                                </Card>
                                                <Card
                                                    bordered={false}
                                                    style={{ marginTop: 16 }}
                                                    type="inner"
                                                    title="卖家信息"
                                                    extra={<a href="#">更多</a>}
                                                >
                                                    <Row>
                                                        <Col span={8}>
                                                            <Card hoverable bordered={false}>
                                                            <Avatar ></Avatar>
                                                                <p
                                                                    style={{
                                                                    fontSize: 14,
                                                                    color: 'rgba(0, 0, 0, 0.85)',
                                                                    marginBottom: 16,
                                                                    fontWeight: 500,
                                                                    }}
                                                                >
                                                                    {this.state['sellerName']}
                                                                </p>
                                                                    联系方式:{this.state['sellerPhoneNum']}
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
                                                <table></table>
                                            <ButtonGroup>
                                                <div id="numChange">
                                                    <table></table>
                                                    <Button disabled={this.state['btnDisable']} type="primary" icon="minus" onClick={this.numChange1}/><p>{this.state['goodsNum']}</p><Button block={true} type="primary" icon="plus" onClick={this.numChange2}/>
                                                </div>
                                            </ButtonGroup>
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className="OperatorsBox">

                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className="OperatorsBox">

                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className="OperatorsBox">

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
