import React from 'react';
import {Get, Post} from '../utils/Request';
import {message, List, Card, Divider, Form, Tag, Collapse, Icon} from 'antd';
import BackstageFreezeUserForm from './BackstageFreezeUserForm';

export default class BackstageUser extends React.Component{
    constructor(props){
        super(props);
        this.state={
            frozenUsers : []
        }
    }
    componentDidMount(){
        const golbalMessage = message;
        let url = '/api/backstage/getFrozenUser';
        let res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){golbalMessage.warn(message)}
            else{
                this.setState({
                    frozenUsers : data
                })
            }
        });
    }
    handleFreezeUser = () =>{
        //刷新组件
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
        const WrappedFreezeUserForm = Form.create({name: 'addAddminForm'})(BackstageFreezeUserForm);
        return(
            <div id='backstageUser'>
                <Divider orientation='left' style={{fontSize:13}}>已冻结用户</Divider>
                <List grid={{ gutter: 16, column: 4 }} dataSource={this.state['frozenUsers']} 
                renderItem={item=>(
                    <List.Item>
                        <Card extra={[
                            <Tag key={item['学号']} color={item['角色']===0?'blue':'magenta'}>{item['角色']===0?'普通用户':'管理员'}</Tag>
                        ]} title={item['用户名']}>联系方式：{item['电话']}<br />学号：{item['学号']}</Card>
                    </List.Item>
                )} />
                <Divider orientation='left' style={{fontSize:13}}>冻结用户</Divider>
                <Collapse bordered={false} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                    <Collapse.Panel header='在这里冻结用户' key='1'
                    style={collapseStyle}>
                        <WrappedFreezeUserForm handleFreezeUser={this.handleFreezeUser} />
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }
}