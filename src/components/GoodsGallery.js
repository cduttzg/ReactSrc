import React, { Component } from 'react';
import { Skeleton, List, Statistic, message } from 'antd';
import {Link} from 'react-router-dom';
import { Get } from '../utils/Request';
import '../stylesheets/GoodsGallery.css';

export default class GoodsGallery extends Component{
    constructor(props){
        super(props);
        let { tag } = this.props['location'].state;
        this.state={
            tag : tag,
            goodsList : []
        }
    }
    componentDidMount(){
        const globalMessage = message;
        let url = `/api/goods/gallery?标签种类=${this.state['tag']}`
        let res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            if(code !== 200){globalMessage.warn(message)}
            else{
                this.setState({
                    goodsList : data 
                })
            }
        });
    }
    render(){
        return(
            <div id='goodsGallery'>
                {this.state['goodsList'] ?<div className='goods-gallery-c1er'>
                    <List itemLayout="horizontal" dataSource={this.state['goodsList']}
                    renderItem={item=>(
                        <List.Item>
                            <List.Item.Meta title={<div className='goods-gallery-header-c1er'><Link to={{pathname:'/goods/details',state:{
                                goodsId : item['商品ID'],
                                goodsName : item['商品名称'],
                                goodsImg : item['商品图片'],
                                goodsInfo : item['描述'],
                                goodsPrice : item['单价'],
                                sellerPhoneNum: item['联系方式'],
                                goodsStock:item['数量'],
                                sellerId : item['卖家ID'],
                                tag: this.state.tag
                            }}}>{item['商品名称']}</Link></div>} description={item['描述']} />
                            <div className='goods-gallery-content-c1er'>
                                <div className='goods-gallery-statistic-c1er'>
                                    <Statistic className='goods-statistic-content-c1er'  title={this.state['tag']==='求购'?'预期价位':'商品定价'} value={item['单价']} suffix='￥' precision={1} />
                                    <Statistic className='goods-statistic-content-c1er' title={this.state['tag']==='求购'?'需求数量':'上架数量'} value={item['数量']} />
                                </div>
                                <div className='goods-gallery-phone-c1er'>{this.state['tag']==='求购'?'卖':'买'}家手机号码 : {item['联系方式']}</div>
                                <img className='goods-gallery-img-c1er' alt={item['商品名称']} src={item['商品图片']} />
                            </div>
                        </List.Item>
                    )}>

                    </List>
                </div>:<div>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </div>}
            </div>
        );
    }
}