import React from 'react';
import { Get } from '../utils/Request';
import { Skeleton, List, Button, Statistic } from 'antd';
import '../stylesheets/OffShelvesGoods.css';

export default class OffShelvesGoods extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user : this.props['user'],
            offShelves : []
        }
    }
    componentDidMount(){
        let url = `/api/user/home/goodsInfo?用户名=${this.state['user'].username}`;
        let res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            let offShelves = data.filter(goods=>{
                return !goods['上架'];
            });
            console.log(this.state)
            this.setState({
                offShelves : offShelves
            });
        });
    }
    render(){
        return(
            <div className='off-goods-c1er'>
                {this.state['offShelves'] ? <List itemLayout='vertical' size='large'
                pagination={{pageSize:3}} dataSource={this.state['offShelves']}
                renderItem={item=>(
                    <List.Item key={item['商品ID']} actions={[
                        <Button type='primary' size='small' shape='round'>重新上架</Button>
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
        );
    }
}