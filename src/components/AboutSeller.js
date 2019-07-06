import React,{ Component, Fragment } from 'react';
import UpGoodsForm from './UpGoodsForm';
import { Divider, message, List, Button, Statistic, Skeleton, Popconfirm, Collapse, Icon, Form, Modal } from 'antd';
import { Post, Get } from '../utils/Request';
import '../stylesheets/AboutSeller.css';

export default class AboutSeller extends Component{
    constructor(props){
        super(props);
        this.state={
            user : this.props['user'],
            onShelves: [],
            offShelves : []
        };
    }
    componentDidMount(){
        let url = `/api/user/home/goodsInfo?username=${this.state['user'].username}`;
        let res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){console.error(message)}
            else{
                let onShelves = data.filter(goods=>{
                    return goods['上架'];
                });
                let offShelves = data.filter(goods=>{
                    return !goods['上架'];
                });
                console.log(this.state)
                this.setState({
                    onShelves : onShelves,
                    offShelves : offShelves
                });
            }
        });
    }
    handlePutClick = (e, id) =>{
        //点击下架按钮
        console.log(e.target);
        const globalMessage = message;
        let url = '/api/user/home/offShelves';
        let data = {
            '商品ID' : id,
            '下架': true
        };
        let res = Post(url, data);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200) globalMessage.error(`アレ，${message}`);
            else{
                if(data.success){
                    globalMessage.success(`やっだ，${message}`);
                    //组件刷新
                    this.componentDidMount();
                }
            }
        });        
    }
    handleOffClick = (e, id, tag) =>{
        //点击重新上架按钮
        console.log(e.target);
        const globalMessage = message;
        let url = '/api/user/home/onShelves';
        let data = {
            '商品ID' : id,
            '商品标签' : tag || '书籍'
        };
        let res = Post(url, data);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200) globalMessage.error(`アレ，${message}`);
            else{
                if(data.success){
                    globalMessage.success(`やっだ，${message}`);
                    //组件刷新
                    this.componentDidMount();
                }
            }
        });
    }
    handlePutGoodsClick = () => {
        //点击将商品上架按钮
        this.componentDidMount();
    }
    render(){
        const collapseStyle = {
            background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden'
        }
        const WrappedUpGoodsForm = Form.create({name: 'upGoodsForm'})(UpGoodsForm);
        return(
            <Fragment>
                <div className='aboutSeller'>
                    <Divider>上架商品信息</Divider>
                    <div className='shelves-c1er'>
                        {this.state['onShelves'] ? <List itemLayout='vertical' size='large'
                        pagination={{pageSize:3}} dataSource={this.state['onShelves']}
                        renderItem={item=>(
                            <List.Item key={item['商品ID']} actions={[
                                <Popconfirm  title='你确定要下架该商品么？'
                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                onConfirm={(e)=>{this.handlePutClick(e,item['商品ID'])}} okText='好的' cancelText='我再想想'>
                                    <Button type='danger' size='small' shape='round'>下架</Button>
                                </Popconfirm>
                            ]} extra={<img className='shelves-imgs-c1er' width={250} alt={item['描述']} src={item['商品图片']}/>}>
                                <List.Item.Meta description={item['描述']}  />
                                <div className='shelves-content-c1er'>
                                    <Statistic className='statistic-content-c1er'  title='商品定价' value={item['单价']} suffix='￥' precision={1} />
                                    <Statistic className='statistic-content-c1er' title='上架数量' value={item['数量']} />
                                </div>
                            </List.Item>
                        )} /> :<Skeleton active />}
                    </div>
                    <Divider>下架商品信息</Divider>
                    <div className='off-goods-c1er'>
                        {this.state['offShelves'] ? <List itemLayout='vertical' size='large'
                        pagination={{pageSize:3}} dataSource={this.state['offShelves']}
                        renderItem={item=>(
                            <List.Item key={item['商品ID']} actions={[
                                <Button onClick={(e)=>{this.handleOffClick(e, item['商品ID'], item['商品标签'])}} type='primary' size='small' shape='round'>
                                    重新上架</Button>
                            ]} extra={<img className='offShelves-imgs-c1er' alt={item['描述']} src={item['商品图片']} /> }>
                                <List.Item.Meta description={item['描述']} />
                                <div className='offShelves-content-c1er'>
                                    <Statistic className='offShelves-statistic-content-c1er'  title='商品定价' value={item['单价']} suffix='￥' precision={1} />
                                    <Statistic className='offShelves-statistic-content-c1er' title='上架数量' value={item['数量']} />
                                </div>
                            </List.Item>
                        )} />
                        :<Skeleton active />}
                    </div>
                </div>
                <Divider>上架商品</Divider>
                <Collapse bordered={false} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                    <Collapse.Panel header='在这里上架商品' key='1'
                    style={collapseStyle}>
                        <WrappedUpGoodsForm user={this.state['user']} handlePutGoodsClick={this.handlePutGoodsClick} />
                    </Collapse.Panel>
                </Collapse>
            </Fragment>
        );
    }
}