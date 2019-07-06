import React from 'react';
import BackstageMangeOrderForm from './BackstageMangeOrderForm';
import { Form, Divider, Collapse, Icon } from 'antd';

export default class BackstageOrders extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        const collapseStyle = {
            background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden'
        }
        const WrappedBackstageMangeOrderForm = Form.create({name: 'addAddminForm'})(BackstageMangeOrderForm);
        return(
            <div id='backstageOrders'>
                <Divider orientation='left' style={{fontSize:13}}>订单操作</Divider>
                    <Collapse  bordered={false} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                    <Collapse.Panel header='在这里标记订单异常' key='1'
                    style={collapseStyle}>
                        <WrappedBackstageMangeOrderForm />
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }
} 