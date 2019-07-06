import React,{ Component } from 'react';
import { Get, Post } from '../utils/Request';
import UpSeekForm from './UpSeekForm';
import { List, Card, Button, Statistic, Popconfirm, message, Divider, Collapse, Icon, Form, Upload, Input } from 'antd';
import '../stylesheets/UserSeekInfo.css';

export default class UserSeekInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            user : this.props['user'],
            seekInfo : []
        }
    }
    componentDidMount(){
        let url = `/api/user/home/SeekInfo?用户名=${this.state['user'].username}`;
        let res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){console.error(message)}
            else{
                this.setState({
                    seekInfo : data
                });
            }
        });
    }
    handleSeekDeleteClick = (e, id) => {
        console.log(e.target);
        let url = '/api/user/home/deleteSeek';
        let data = {
            '商品ID' : id
        };
        const globalMessage = message;
        let res = Post(url, data);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200) globalMessage.error(`アレー，${message}`);
            else{
                //组件刷新
                this.componentDidMount();
            }
        });
    }
    handleSeekUpClick = () => {
        //通知组件刷新
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
        const WrappedUpSeekForm = Form.create({ name: 'upSeekForm' })(UpSeekForm);
        return(
            <div className='userSeek'>
                <List grid={{ gutter: 16, column: 3 }}
                dataSource={this.state['seekInfo']} 
                renderItem={item=>(
                    <List.Item>
                        <Card hoverable cover={
                            <img alt={item['商品名称']} src={item['商品图片']} />
                        } actions={[
                            <Popconfirm title='你确定要删除该求购么？' onConfirm={(e)=>{this.handleSeekDeleteClick(e,item['商品ID'])}} okText='好的' cancelText='我再想想' >
                                <Button shape='round' type='danger' ghost>删除求购</Button>
                            </Popconfirm>
                        ]}>
                            <Card.Meta title={item['商品名称']} description={item['描述']} />
                            <div className='seek-info-c1er'>
                                <Statistic className='seek-content-c1er' title='预期价格' value={item['单价']} suffix='￥' precision={1} />
                                <Statistic className='seek-content-c1er' title='求购数量' value={item['数量']} />
                            </div>
                        </Card>
                    </List.Item>
                )} />
                <Divider>发布求购</Divider>
                <Collapse bordered={false} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                    <Collapse.Panel header='在这里发布你的求购' key='1'
                    style={collapseStyle}>
                        <WrappedUpSeekForm user={this.state['user']} handleSeekUpClick={this.handleSeekUpClick} />
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }
}