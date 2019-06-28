import React,{Component} from 'react'
import '../styleSheets/Cart.css'
import { Popover, Button, Avatar, List, message, Spin, Badge } from 'antd';
import reqwest from 'reqwest';
import InfiniteScroll from 'react-infinite-scroller';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

class InfiniteListExample extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
  };
  componentDidMount() {
    this.fetchData(res => {
      this.setState({
        data: res.data.data,
      });
    });
  }

  fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };

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
    this.fetchData(res => {
      data = data.concat(res.results);
      this.setState({
        data,
        loading: false,
      });
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
                    <span style={{ marginRight: 24}}>
                      {/*商品数量*/}
                      <Badge count={item["数量"]}>
                        <Avatar shape="square" src={item["商品图片"]} />
                      </Badge>
                    </span>
                  }
                  //商品名称
                  title={<a href="https://ant.design">{item["商品名称"]}</a>}
                  description={//商品描述
                    item["描述"]}
                />
                <div>{/*商品总价*/}￥{item["单价"]}</div>
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
        //<InfiniteListExample></InfiniteListExample>
        <div>content</div>
      );

    return(
      <Popover content={content}>
          <div id="CartDiv">
            <Button id="Cart" type="primary"><div id="cartImg"></div><span>进入购物车</span></Button>
          </div>
      </Popover>
    );
  }
}

