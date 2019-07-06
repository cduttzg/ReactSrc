import React,{Component} from 'react'
import {Layout, Row, Col, Card, Checkbox, Button, Modal, Steps, message } from 'antd'
import '../stylesheets/ShowCart.css';
import {Post,Get} from '../utils/Request';
const{confirm}=Modal;
const{Step} = Steps;

export default class ShowCart extends Component{

  constructor(props){
      super(props);
      let checkMap = new Map();
      console.log('进入购物车详情页！');
      let username = window.sessionStorage.getItem('username');
      console.log(username);
      console.log(window.sessionStorage);
      this.state={
        //接收参数
        userName:username,
        orderId : -1,
        sellerName:[],
        goodsInfo:[],
        goodsPrice:[],
        plainOptions:[],//goodsId
        goodsNum:[],
        goodsStock:[],
        sellerPaymentCode:[],
        //维护状态
        checckedList:checkMap,
        indeterminate:false,
        checkAll:false,
        add:[],
        btnDisable1:[],//减按钮
        btnDisable2:[],//加按钮
        loading: false,
        visible: false,
        current:0,
        success:false,
        totalPrice:0,
        steps : [{
          title: 'test',
          content: <img alt={"收款码"}/>
        }]
        //success:0
      }
  }

  onChange = checkedList => {
      this.setState({
        checkedList,
        indeterminate: !!checkedList.length && checkedList.length < this.state['plainOptions'].length,
        checkAll: checkedList.length === this.state['plainOptions'].length,
      });
    };

    onCheckAllChange = e => {
      this.setState({
        checkedList: e.target.checked ? this.state['plainOptions'] : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    };
    handleResolveClick = (groupId) =>{
        let  checckedList  = this.state['checckedList'];
        if(checckedList.has(groupId)){
            checckedList.delete(groupId);
            this.setState({
              checckedList: checckedList,
              checkAll: false,
              indeterminate: checckedList.size!==0
            })
        }else{
          checckedList.set(groupId,groupId);
          this.setState({
            checckedList: checckedList,
            indeterminate : true
          })
          if(checckedList.size===this.state['plainOptions'].length){
              this.setState({
                checkAll: true,
                indeterminate : false
              });
          }
        }
        this.getTotalNumber();
    }
    handleResolveCheckAll = (checkAll) =>{
        
        if(checkAll){
            let checckedList = this.state['checckedList'];
            checckedList.clear();
            this.setState({
              checkAll: false,
              checckedList: checckedList,
              indeterminate : false
            })
        }else{
          let plainOptions = this.state['plainOptions'];
          let checckedList = this.state['checckedList'];
          plainOptions.map(v=>{
              checckedList.set(v,v);
          })
            this.setState({
              checckedList : checckedList,
              checkAll : true,
              indeterminate : false
            })
        }
    }
    getTotalNumber = ()=>{
      const map = this.state.checckedList;
      let total = 0;

      console.log(map)
      for(let i of map.values()){
        let index = this.state.plainOptions.indexOf(i);
        console.log(index)
        total+=(this.state.goodsNum[index]*this.state.goodsPrice[index]);
      }

      this.setState({
        totalPrice : total
      })
    }
  //数量减少
  numChange1 = (i)=>{
    this.state.add[i]=false;//执行减法
    this.handleUpdateCartInfo(this.state.userName,this.state.plainOptions[i],this.state.add[i]);
    if(this.state['goodsNum'][i]===1){
      let a = this.state['goodsNum'];
      --a[i];
      let c=this.state['btnDisable1'];
      c[i]=true;
        this.setState({
            btnDisable1: c,
            goodsNum: a,
        })
    }else{
      let b = this.state['goodsNum'];
      --b[i];
      let c1=this.state['btnDisable1'];
      c1[i]=false;
      let c2=this.state['btnDisable2'];
      c2[i]=false;
        this.setState({
            btnDisable1: c1,
            btnDisable2: c2,
            goodsNum: b
        })
    }   
    this.getTotalNumber();
  }

  //数量增加
  numChange2(i){
    this.state.add[i]=true;//执行加法
    this.handleUpdateCartInfo(this.state.userName,this.state.plainOptions[i],this.state.add[i]);
      if(this.state['goodsNum'][i]===this.state['goodsStock'][i]-1){
        let a = this.state['goodsNum'];
        a[i]++;
        let c=this.state['btnDisable2'];
        c[i]=true;
        this.setState({
            btnDisable2: c,
            goodsNum: a,
        })
      }else{
        let a = this.state['goodsNum'];
        a[i]++;
        let c2=this.state['btnDisable2'];
        c2[i]=false;
        let c1=this.state['btnDisable1'];
        c1[i]=false;
        this.setState({
            goodsNum: a,
            btnDisable2: c2,
            btnDisable1: c1,
        })
      }
      this.getTotalNumber();
  }

  showConfirm1() {
    confirm({
      title: '删除商品',
      content: '确认要删除该商品吗?',
      okText: '确认',
      cancelText: '关闭',
      onOk() {
        message.success('该商品已删除_(:ι」∠)_',1.5);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  showConfirm2() {
    confirm({
      title: '删除商品',
      content: '确认要删除选中的商品吗?',
      okText: '确认',
      cancelText: '关闭',
      onOk() {
        message.success('该商品已删除_(:ι」∠)_',1.5);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  componentDidMount(){
    //获取购物车信息
    //this.handleCartInfo(this.state.userName);
    const globalMessage = message;
    let url = `/api/cart/cartInfo?用户名=${this.state['userName']}`;
    let res = Get(url);
    res.then(response=>{
        let {code, message, data} = response;
        if(code!==200){
            globalMessage.warn(message);
        }else{
          console.log('输出data')
          console.log(data);
          //获取购物车信息成功
          data.map((v,i)=>{
            const sellerName = this.state.sellerName;
            const goodsInfo = this.state.goodsInfo;
            const goodsPrice = this.state.goodsPrice;
            const plainOptions = this.state.plainOptions;
            const goodsNum = this.state.goodsNum;
            const goodsStock = this.state.goodsStock;
            const sellerPaymentCode = this.state.sellerPaymentCode;
            this.setState({
              sellerName:[...sellerName,v['卖家名称']],
              goodsInfo:[...goodsInfo,v['描述']],
              goodsPrice:[...goodsPrice,v['单价']],
              plainOptions:[...plainOptions,v['商品ID']],
              goodsNum:[...goodsNum,v['数量']],
              goodsStock:[...goodsStock,v['商品库存']],
              sellerPaymentCode: [...sellerPaymentCode,v['收款码']]
            });
          });
          let num = this.state.goodsNum.length;
          let add = new Array(num),btnDisable1 = new Array(num),btnDisable2 = new Array(num);
          add.fill(false);
          btnDisable1.fill(false);
          btnDisable2.fill(false);
          
          console.log('获取数据了！');
          console.log(this.state);
          console.log(this.state.sellerName)
          console.log(this.state.sellerName.length)

              //step
    let steps = [];
    this.state.sellerName.map((v,i)=>{
      let obj = {
        title: v,
        content: <img src={this.state['sellerPaymentCode'][i]} alt={"收款码"}/>
      }
      steps.push(obj);
    });
    this.setState({
      steps : steps
    })
        }
    });
  }

  //获取购物车信息
  handleCartInfo = (username) =>{
    const globalMessage = message;
    let url = `/api/cart/cartInfo?用户名=${username}`;
    let res = Get(url);
    res.then(response=>{
        let {code, message, data} = response;
        if(code!==200){
            globalMessage.warn(message);
        }else{
          console.log(data);
          //获取购物车信息成功
          data.map((v,i)=>{
            const sellerName = this.state.sellerName;
            const goodsInfo = this.state.goodsInfo;
            const goodsPrice = this.state.goodsPrice;
            const plainOptions = this.state.plainOptions;
            const goodsNum = this.state.goodsNum;
            const goodsStock = this.state.goodsStock;
            this.setState({
              sellerName:[...sellerName,v['卖家名称']],
              goodsInfo:[...goodsInfo,v['描述']],
              goodsPrice:[...goodsPrice,v['单价']],
              plainOptions:[...plainOptions,v['商品ID']],
              goodsNum:[...goodsNum,v['数量']],
              goodsStock:[...goodsStock,v['商品库存']],
            });
          });
          let num = this.state.goodsNum.length;
          let add = new Array(num),btnDisable1 = new Array(num),btnDisable2 = new Array(num);
          add.fill(false);
          btnDisable1.fill(false);
          btnDisable2.fill(false);
          
          console.log('获取数据了！');
          console.log(this.state);
          console.log(this.state.sellerName)
          console.log(this.state.sellerName.length)
        }
    });
  }

  //更新购物车信息
  handleUpdateCartInfo = (username, goodsId, add) =>{
    const globalMessage = message;
    let url = '/api/cart/updateCartInfo';
    let data = {
        '用户名':username,
        '商品ID':goodsId,
        add: add
    }
    let res = Post(url, data);
    res.then(response=>{
        let {code, message, data} = response;
        if(code!==200){
            globalMessage.warn(message);
        }else{
            //更新购物车信息成功
          this.setState({
            success:code
          });
        }
    });
  }

  handleOk = e => {
      console.log(e);
      //调用创建订单API,返回success
      const globalMessage = message;
      let url = '/api/user/buyer/paidOrder';
      let data = {
        '买家用户名' : this.state.userName,
        '订单ID' : this.state.orderId
      }
      let res = Post(url, data);
      res.then(response=>{
        let {code, message, data} = response;
        if(code!==200){globalMessage.error(message)}
        else{
          globalMessage.success('你已成功付款！');
          this.setState({
            //这一行可能会引起BUG
            //实现本地清空购物车
            plainOptions : []
          })
        }
      });
      this.setState({
          visible: false,
      });
  };

  handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
  };
  
  handleClick = () => {
    this.setState({
      loading:true,  
    });
    //立即购买获取订单ID
    const globalMessage = message;
    let url = '/api/cart/createOrder';
    let data = {
      '用户名':this.state.userName
    }
    let res = Post(url, data);
    res.then(response=>{
      let {code, message, data} = response;
      if(code!==200){globalMessage.error(message)}
      else{
        this.setState({
          orderId : data['订单ID']
        });
    //延时
    setTimeout(() => {
      this.setState({
        loading: false,
        visible:true
      });
    }, 500);
      }
    });
  };

  next() {
    const current = this.state['current'] + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state['current'] - 1;
    this.setState({ current });
  }

  handleDone = e => {
      console.log(e);

      //this.state.success?message.loading("正在提交...",0.5).then(()=>message.success('您已经完成支付! 卖家会在24小时内尽快联系您๑乛◡乛๑',2.5),undefined):message.loading("正在提交...",0.5).then(()=>message.error('很抱歉,创建订单失败!我们将尽快进行处理!!!∑(ﾟДﾟノ)ノ',2.0),undefined);
      this.setState({
          visible: false,
      });
  };


  render(){
    console.log('进入购物车了！');
    //当前付款卖家索引
    const { current } = this.state;
    console.log(this.state);
    console.log(current)
    //布局内容
    const {Content} = Layout;
    //按钮组
    const ButtonGroup=Button.Group;
    return(
      <div id='showCart'>
      {this.state.sellerName.length<=0&&this.state.steps.length<=0?null:
      <Layout> 
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
      <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
      <Card bordered={false} style={{ width: '100%', background: '#fff' }}>
          <Row type="flex" justify="space-between">
              <Col span={3}>
                  <Checkbox indeterminate={this.state['indeterminate']} checked={this.state['checkAll']} onChange={(e)=>{
                      this.handleResolveCheckAll(!e.target.checked);
                  }}>全选</Checkbox>
              </Col>
              <Col span={5}>商品信息</Col>
              <Col span={1}>单价</Col>
              <Col span={4}>数量</Col>
              <Col span={1}>金额</Col>
              <Col span={2}>操作</Col>
          </Row>
      </Card>
      {this.state['plainOptions'].map((v,i)=>(<Card key={i}>
              <Checkbox checked={this.state['checckedList'].has(v)} groupId={v} onChange={(e)=>{
                      this.handleResolveClick(e.target['groupId']);
                      console.log(this.state['checckedList'].has(v));
              }}></Checkbox>
          <div>
          {/* <span className="sellerName">{this.state['sellerName'][i]}</span> */}
            <Row type="flex" justify="space-between">
              <Col span={3}><img src="" alt=""></img></Col>
              <Col span={5}><div><span className="goodsInfo">{this.state['goodsInfo'][i]}</span></div></Col>
              <Col span={1}><span>￥{this.state['goodsPrice'][i]}</span></Col>
              <Col span={4}>
                <ButtonGroup>
                  <div id="numChange">
                      <Button className='btn-Jankin' disabled={this.state['btnDisable1'][i]} type="primary" icon="minus" onClick={() => {this.numChange1(i)}}/>
                      <span className='span-Jankin'>{this.state['goodsNum'][i]}</span>
                      <Button className='btn-Jankin' disabled={this.state['btnDisable2'][i]} type="primary" icon="plus" onClick={() => {this.numChange2(i)}}/>
                  </div>
                </ButtonGroup>
              </Col>
              <Col span={1}>￥{this.state['goodsPrice'][i]*this.state['goodsNum'][i]}</Col>
              <Col span={2}><Button onClick={this.showConfirm1}>删除</Button></Col>
            </Row>
          </div>
          </Card>))}
      </div>
      <div id="placeHolder"></div>
      <div style={{ background: '#e7e7e7', padding: 24, minHeight: 50, width : '100%', position: "relative", bottom:100, right: 0}}>
        <div>
        <Row type="flex" justify="space-between">
              <Col span={3}>已选商品<span>{this.state.checckedList.size}</span>件</Col>
              <Col span={2}>合计￥{this.state.totalPrice}</Col>
              <Col span={2}><Button onClick={this.showConfirm2}>删除</Button></Col>
            </Row>
        </div>
        <Button type="primary" shape="round" icon="pay-circle" size="large" loading={this.state['loading']} onClick={this.handleClick}>
          立即购买
        </Button>
        <Modal
          title="付款窗口"
          visible={this.state['visible']}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Steps current={current}>
              {this.state.steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">{this.state.steps[current].content}</div>
            <div className="steps-action">
              {current < this.state.steps.length - 1 && (
                <Button type="primary" onClick={() => this.next()}>
                  为下一件商品付款
                </Button>
              )}
              {current === this.state.steps.length - 1 && (
                <Button type="primary" onClick={this.handleOk}>
                  完成
                </Button>
              )}
              {current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  返回上一件商品
                </Button>
              )}
            </div>
          </div>
        </Modal>
      </div>
      </Content>
    </Layout>
      }
      </div>
    )
  }

}