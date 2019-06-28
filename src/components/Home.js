import React,{ Component } from 'react';
import ShowLatestOrders from './ShowLatestOrders';
import GoodsInfo from './GoodsInfo';
import { Get } from '../utils/Request';
import '../stylesheets/Home.css';

export default class Home extends Component{
    constructor(props){
        super(props);
        this.state={
            books : [],
            virtuals : [],
            houses : [],
            activities : []
        }
    }
    componentDidMount(){
        let url = '/api/home';
        const res = Get(url);
        res.then(response=>{
            let {code, message, data} = response;
            this.setState({
                books : data['书籍'],
                virtuals : data['虚拟'],
                houses : data['房子'],
                others : data['其它'],
                activities : data['福利']
            });
        });
    }
    render(){
        let allGoods = [];
        let allGoodsName = ['书籍', '虚拟', '房子', '其它', '福利'];
        for(let i in this.state) allGoods=[...allGoods,this.state[i]];
        return(
            <div id='home'>{
                allGoods.map((v,i)=>{
                    return(
                        <GoodsInfo key={i} name={allGoodsName[i]} goods={v} />
                    );
                })}
            </div>
        );
    }
}