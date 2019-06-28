import React,{Component} from 'react';
import { Carousel, Radio } from 'antd';
import '../stylesheets/ShowLatestOrders.css';

export default class ShowLatestOrders extends Component{
    state = {
        dotPosition: 'right',
    }
    render(){
        const { dotPosition } = this.state;
        return (
            <Carousel autoplay>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
            </Carousel>
        );
    }
}