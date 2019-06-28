import React,{Component} from 'react'
import {Menu,Icon,Anchor} from 'antd'
import '../styleSheets/Nav.css'

export default class Nav extends Component {

  constructor(props){
    super(props);
    this.state={
      userName:"XXX",
    };
  }

  

  handleClick = e => {
    console.log('click ', e);
  };

  render() {
    return (
      <Anchor>
        <Menu id="Menu"
          onClick={this.handleClick}
          style={{ width: 256 }}
          mode="inline"
        >
          <Menu.ItemGroup id="ItemGroup" title="导航">
            <Icon type="line" style={{fontSize:'50px'}}/>
            <Menu.Item key="1"><Icon type="book" style={{fontSize:'30px'}}/>书籍</Menu.Item>
            <Menu.Item key="2"><div className="NavImg1"></div><div className="NavSpan">虚拟</div></Menu.Item>
            <Menu.Item key="3"><Icon type="home" style={{fontSize:'30px'}}/>出租房</Menu.Item>
            <Menu.Item key="4"><div className="NavImg2"></div><div className="NavSpan">求购专区</div></Menu.Item>
            <Menu.Item key="5"><Icon type="shopping" style={{fontSize:'30px'}}/>今日秒杀</Menu.Item>
            {/*<div id="flashSale">
              <a href="#">
                <ul>
                  <li><span>名称</span></li>
                  <li><span>简介</span></li>
                </ul>
              </a>
              <a href="#" id="aSaleImg"><div id="saleImg"></div></a>
            </div>*/}
          </Menu.ItemGroup>
        </Menu>
      </Anchor>
      
    );
  }
}