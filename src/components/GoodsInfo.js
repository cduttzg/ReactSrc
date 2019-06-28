import React from 'react';
import { Skeleton, Switch, Card, Icon, Avatar, Divider} from 'antd';
import '../stylesheets/GoodsInfo.css';

const { Meta } = Card;
export default class GoodsInfo extends React.Component{
    render(){
        const goods = this.props['goods'];
        console.log(goods);
        return (
            <div className='goodsInfo'>
                {!goods.length ? <div><Skeleton active /><Skeleton active /></div> :<div className='content'>
                    <Divider style={{fontSize: 23}}  orientation='left'>{this.props['name']}</Divider>
                {
                    goods.map((value, index)=>{
                        return (
                            <Card key={index} hoverable style={{width:200, float:"left",marginBottom: 10, marginLeft:25, marginRight: 20 }} 
                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
                                <Meta title={value['商品名称']} description={value['商品描述']} />
                            </Card>
                        );
                    })
                }</div>}
            </div>
        );
    }
}