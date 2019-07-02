import React,{Component} from 'react'
import {Layout, Row, Col, Card, Checkbox, Button, Modal } from 'antd'
import '../styleSheets/ShowCart.css'
const CheckboxGroup = Checkbox.Group;
const{confirm}=Modal;

export default class ShowCart extends Component{

  constructor(props){
      super(props);
      //defaultCheckedGoods=this.props.goodsId,
      //plainOptions=this.props.goodsIds,
      let checkMap = new Map();
      this.state={
          checckedList:checkMap,//defaultCheckedGoods,
          indeterminate:false,
          checkAll:false,
          sellerName:["小白","小红","小灰","小黑"],
          plainOptions:[0,1,2,5],
          goodsInfo:["小白的毛衣","小红的帽子","小灰的裤子","小黑鞋子"],
          goodsPrice:[11,22,33,44],
          goodsNum:[1,2,3,4],
          goodsStock:[10,20,30,40],
          btnDisable1:[false,false,false,false],
          btnDisable2:[false,false,false,false],
          loading: false,
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

  numChange1 = (i)=>{
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
  }

  numChange2(i){
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
  }

  showConfirm() {
    confirm({
      title: '删除商品',
      content: '确认要删除该商品吗?',
      okText: '确认',
      cancelText: '关闭',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  
  handleClick = () => {
    this.setState({
      loading:true,
    });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 2000);
  };
  
  enterLoading = () => {
    this.setState({ loading: true });
  };

  render(){
    const {Content} = Layout;
    const ButtonGroup=Button.Group;
    return(
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
                <Col span={1}>数量</Col>
                <Col span={1}>金额</Col>
                <Col span={1}>操作</Col>
            </Row>
        </Card>
        {this.state['plainOptions'].map((v,i)=>(<Card key={i}>
                <Checkbox checked={this.state['checckedList'].has(v)} groupId={v} onChange={(e)=>{
                        this.handleResolveClick(e.target['groupId']);
                        console.log(this.state['checckedList'].has(v));
                }}></Checkbox>
            <div>
              <Row type="flex" justify="space-between">
                <Col span={3}><img src="" alt=""></img></Col>
                <Col span={5}><div><span className="sellerName">{this.state['sellerName'][i]}</span><span className="goodsInfo">{this.state['goodsInfo'][i]}</span></div></Col>
                <Col span={1}><span>￥{this.state['goodsPrice'][i]}</span></Col>
                <Col span={1}>
                  <ButtonGroup>
                    <div id="numChange">
                        <Button className='btn-Jankin' disabled={this.state['btnDisable1'][i]} type="primary" icon="minus" onClick={() => {this.numChange1(i)}}/>
                        <span className='span-Jankin'>{this.state['goodsNum'][i]}</span>
                        <Button className='btn-Jankin' disabled={this.state['btnDisable2'][i]} type="primary" icon="plus" onClick={() => {this.numChange2(i)}}/>
                    </div>
                  </ButtonGroup>
                </Col>
                <Col span={1}>￥{this.state['goodsPrice'][i]*this.state['goodsNum'][i]}</Col>
                <Col span={1}><Button onClick={this.showConfirm}>删除</Button></Col>
              </Row>
            </div>
            </Card>))}
        </div>
        <div id="placeHolder"></div>
        <div style={{ background: '#e7e7e7', padding: 24, minHeight: 66, width : '50%', position: "fixed", bottom: 0, right: 0}}>
          <div>
          <Row type="flex" justify="space-between">
                <Col span={3}>已选商品<span>{}</span>件</Col>
                <Col span={2}>合计￥{}</Col>
                <Col span={2}><Button onClick={this.showConfirm}>删除</Button></Col>
              </Row>
          </div>
          <Button type="primary" shape="round" icon="pay-circle" size="large" loading={this.state['loading']} onClick={this.handleClick}>
            立即购买
          </Button>
        </div>
        </Content>
      </Layout>
    )
  }

}