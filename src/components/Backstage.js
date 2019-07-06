import React,{Component} from 'react';
import {Get, Post} from '../utils/Request';
import { Divider, Skeleton } from 'antd';
import BackstageAdmin from './BackstageAdmin';
import BackstageUser from './BackstageUser';
import BackstageOrders from './BackstageOrders';
import LineGraph from './LineGraph';
import Histogram from './Histogram';
import PieChart from './PieChart';
import '../stylesheets/Backstage.css'

export default class Backstage extends Component{
    constructor(props){
        super(props);
        this.state={
            data : null
        }
    }
    componentDidMount(){
        let url = '/api/backstage/getData';
        let res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){console.log(message)}
            else{
                this.setState({
                    data : data
                })
            }
        });
    }
    render(){
        return(
            <div id='backStage'>
                <Divider>大数据实时分析</Divider>
                <div id='graphs'>
                    <Divider orientation='left' style={{fontSize:13}}>网站日交易量折线图</Divider>
                    <div className='graphDetail'>
                        {this.state['data'] ? <LineGraph data={this.state['data']['网站日交易量']}  /> :<Skeleton active />}
                    </div>
                    <Divider orientation='left' style={{fontSize:13}}>网站活跃度直方图</Divider>
                    <div className='graphDetail'>
                        {this.state['data'] ? <Histogram data={this.state['data']['网站活跃度']} /> :<Skeleton active />}
                    </div>
                    <Divider orientation='left' style={{fontSize:13}}>学生求购需求饼图</Divider>
                    <div className='graphDetail'>
                        {this.state['data'] ? <PieChart data={this.state['data']['求购数量']} /> :<Skeleton active />}
                    </div>
                </div>
                <Divider>管理中心</Divider>
                {this.props['location'].state.role===1?null:<BackstageAdmin />}
                <BackstageUser />
                <BackstageOrders />
            </div>
        );
    }
}