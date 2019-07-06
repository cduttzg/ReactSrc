import React,{Component} from 'react';
import {Get, Post} from '../utils/Request';
import {message, List, Card, Divider, Button, Popconfirm, Icon, Collapse, Form} from 'antd';
import BackstageAddAdminForm from './BackstageAddAdminForm';


export default class BackstageAdmin extends Component{
    constructor(props){
        super(props);
        this.state={
            admins : []
        }
    }
    componentDidMount(){
        const golbalMessage = message;
        let url = '/api/backstage/getAdmin';
        let res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){golbalMessage.warn(message)}
            else{
                this.setState({
                    admins : data
                })
            }
        });
    }
    handleDeleteAdmin = (schoolCardNumber) => {
        const golbalMessage = message;
        let url = '/api/backstage/deletAdmin';
        let data = {
            '用户学号' : schoolCardNumber
        }
        let res = Post(url, data);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!== 200){golbalMessage.warn(`え、${message}`)}
            else{
                golbalMessage.success('成功删除该管理员');
                //组件刷新
                this.componentDidMount();
            }
        });
    }
    handleGetSchoolCardNumber = (username) => {
        let url = `/api/user/home/message?用户名=${username}`;
        let res = Get(url);
        res.then(response=>{
            let {code, data} = response;
            if(code===200){
                this.handleDeleteAdmin(data['学号']);
            }
        })
    }
    handleAddAdmin = () => {
        //组件刷新
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
        const WrappedAddAdminForm = Form.create({name: 'addAddminForm'})(BackstageAddAdminForm);
        return(
            <div id='backstageAdmin'>
                <Divider orientation='left' style={{fontSize:13}}>所有管理员</Divider>
                <List grid={{ gutter: 16, column: 4 }} dataSource={this.state['admins']} 
                renderItem={item=>(
                    <List.Item>
                        <Card extra={[
                            <Popconfirm key={item['用户名']} title='你确定要删除该管理员么？'
                            onConfirm={()=>{this.handleGetSchoolCardNumber(item['用户名'])}}
                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                            okText='好的' cancelText='我再想想'>
                                <Button size='small' type='danger'>删除</Button>
                            </Popconfirm>
                        ]} title={item['用户名']}>联系方式：{item['电话']}</Card>
                    </List.Item>
                )} />
                <Divider orientation='left' style={{fontSize:13}}>添加管理员</Divider>
                <Collapse  bordered={false} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                    <Collapse.Panel header='在这里添加管理员' key='1'
                    style={collapseStyle}>
                        <WrappedAddAdminForm handleAddAdmin={this.handleAddAdmin} />
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }
}