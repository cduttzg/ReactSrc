import React from 'react';
import {Link} from 'react-router-dom';
import { Skeleton, Card, Divider} from 'antd';
import '../stylesheets/GoodsInfo.css';

const { Meta } = Card;
export default class GoodsInfo extends React.Component{
    render(){
        const goods = this.props['goods'];
        console.log('进入Googoods');
        console.log(goods);
        return (
            <div className='goodsInfo'>
                {!goods.length ? <div><Skeleton active /><Skeleton active /></div> :<div className='content'>
                    <Divider style={{fontSize: 23}}  orientation='left'><Link to={{
                        pathname:'/goods/gallery',
                        state: {tag : this.props.name}
                    }}>{this.props['name']}</Link></Divider>
                {
                    goods.map((value, index)=>{
                        return (
                            <Link to={{
                                pathname : '/goods/details',
                                state:{
                                    goodsId : value['商品ID'],
                                    goodsName: value['商品名称'],
                                    goodsImg : value['商品图片'],
                                    goodsInfo : value['描述'],
                                    goodsPrice : value['单价'],
                                    goodsStock:value['数量'],
                                    sellerId : value['卖家ID'],
                                    sellerPhoneNum : value['联系方式'],
                                    tag: this.props.name,
                                }
                            }}>
                                <Card key={index} hoverable style={{width:200, float:"left",marginBottom: 10, marginLeft:25, marginRight: 20 }} 
                                cover={<img alt={value['商品名称']} src={value['商品图片']} />}>
                                <Meta title={value['商品名称']} description={value['商品描述']} />
                                </Card>
                            </Link>
                        );
                    })
                }</div>}
            </div>
        );
    }
}