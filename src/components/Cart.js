import React,{Component} from 'react'
import '../stylesheets/Cart.css'
import { Popover, Button, Avatar, List, message, Spin, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { Get } from '../utils/Request';
import InfiniteScroll from 'react-infinite-scroller';

class InfiniteListExample extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
    username : this.props.username || window.sessionStorage.getItem('username')
  };
  componentDidMount() {
    let url = `/api/home/cartInfo?用户名=${this.state.username}`;
    console.log(this.state);
    console.log(window.sessionStorage);
    let res = Get(url);
    res.then(response=>{
      let {code,message,data} = response;
      this.setState({
        data : data.data
      })
    });
  }

  handleInfiniteOnLoad = () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });
    if (data.length > 14) {
      message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    let url = `/api/cart/cartInfo?用户名=${this.state.username}`;
    let res = Get(url);
    res.then(response=>{
      let {code,message,data} = response;
      const dataNew = data.concat(data.data);
      this.setState({
        data : dataNew,
        loading : false
      })
    });
  };

  render() {
    return (
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <List
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <span style={{ marginRight: 14}}>
                      {/*商品数量*/}
                      <Badge count={item["数量"]}>
                        <Avatar shape="square" src={item["商品图片"]} />
                      </Badge>
                    </span>
                  }
                  //商品名称
                  title={item["商品名称"]}
                  // description={//商品描述
                  //   item["描述"]}
                />
                {/** 
                <div>{/*商品总价}￥{item["单价"]}</div>
                */}
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

export default class Cart extends Component{

  constructor(props){
      super(props);
      this.state={
        value:"e"
      }
  }    

  render(){   
    const content = (
        <InfiniteListExample username={window.sessionStorage.getItem('username')} />
      );

    return(
      <Link to={{
        pathname : '/cart/details',
        state : {username: this.props.username}
      }}>
        <Popover content={content}>
          <div id="CartDiv">
            <Button id="Cart" type="primary"><div id="cartImg"></div><span>进入购物车</span></Button>
          </div>
        </Popover>
      </Link>
    );
  }
}

