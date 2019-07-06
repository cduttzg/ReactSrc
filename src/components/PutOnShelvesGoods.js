import React from 'react';
import { List, Skeleton, Button, Statistic, message } from 'antd';
import { Get, Post } from '../utils/Request';
import '../stylesheets/PutOnShelvesGoods.css';

export default class PutOnShelvesGoods extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user : this.props['user'],
            onShelves: []
        }
    }
    componentDidMount(){
        let url = `/api/user/home/goodsInfo?用户名=${this.state['user'].username}`;
        let res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){console.error(message)}
            else{
                let onShelves = data.filter(goods=>{
                    return goods['上架'];
                });
                console.log(this.state)
                this.setState({
                    onShelves : onShelves
                });
            }
        });
    }
    handleClick = (e, id) => {
        console.log(e.target);
        const globalMessage = message;
        const onShelves = this.state['onShelves'];
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
                    //页面重定向
                    this.props.handlePageRefresh();
                }
            }
        });
    }
    render(){
        return(
            <div className='shelves-c1er'>
                {this.state['onShelves'] ? <List itemLayout='vertical' size='large'
                pagination={{pageSize:3}} dataSource={this.state['onShelves']}
                renderItem={item=>(
                    <List.Item key={item['商品ID']} actions={[
                        <Button onClick={this.handleClick} type='danger' size='small' shape='round'>下架</Button>
                    ]} extra={<img className='shelves-imgs-c1er' width={250} alt={item['描述']} src={item['商品图片']}/>}>
                        <List.Item.Meta description={item['描述']}  />
                        <div className='shelves-content-c1er'>
                            <Statistic className='statistic-content-c1er'  title='商品定价' value={item['单价']} suffix='￥' precision={1} />
                            <Statistic className='statistic-content-c1er' title='上架数量' value={item['数量']} />
                        </div>
                     </List.Item>
                )} /> :<Skeleton active />}
            </div>
        );
    }
}