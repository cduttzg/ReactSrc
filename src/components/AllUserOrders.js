import React,{Component} from 'react';
import { Skeleton, List } from 'antd';
import { Get } from '../utils/Request';
import '../stylesheets/AllUserOrders.css'

export default class AllUserOrders extends Component{
    constructor(props){
        super(props);
        this.state={
            user: this.props['user'],
            orders: []
        };
    }
    componentDidMount(){
        let url = `/api/user/home/orderInfo?用户名=${this.state['user'].username}`;
        let res = Get(url);
        res.then(response=>{
            const {code, message, data} = response;
            if(code!==200){console.error(message)}
            else{
                this.setState({
                    orders: data
                });
            }
        });
    }
    render(){
        return(
            <div className='orders-c1er'>
                {this.state['orders'] ?<List itemLayout='horizontal'
                dataSource={this.state['orders']}
                renderItem={item=>(<List.Item>
                    <List.Item.Meta title={`订单编号：${item['订单ID']} 状态：${item['订单状态']}`} description={item['订单时间']} />
                    <div className='orders-goods-contents-cler'>{(item['卖家记录'])[0]['商品名称']}
                    </div>
                </List.Item>)} /> :<Skeleton active />}
            </div>
        );
    }
}