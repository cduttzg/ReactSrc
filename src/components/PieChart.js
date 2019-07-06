import { Chart, Tooltip, Axis, Legend, Pie, Coord } from 'viser-react';
import * as React from 'react';
import { DataSet } from '@antv/data-set';


export default class PieChart extends React.Component {
  
  render() {
    // const sourceData = [
    //   { tag: '水票', count: 40 },
    //   { tag: '书籍', count: 21 },
    //   { tag: '寝室神器', count: 17 },
    //   { tag: '租房', count: 13 },
    //   { tag: '文具', count: 9 },
    //   { tag: '电脑办公', count: 40 },
    //   { tag: '游戏道具', count: 21 },
    //   { tag: '体育用具', count: 17 },
    //   { tag: '乐器', count: 13 },
    //   { tag: '电器', count: 9 },
    //   { tag: '装饰品', count: 13 },
    //   { tag: '其他', count: 9 },
    // ];
    const sourceData = this.props.data;
    const scale = [{
      dataKey: 'percent',
      min: 0,
      formatter: '.0%',
    }];
    
    const dv = new DataSet.View().source(sourceData);
    dv.transform({
      type: 'percent',
      field: '数量',
      dimension: 'tag',
      as: 'percent'
    });
    const data = dv.rows;
    return (
      <Chart forceFit height={400} data={data} scale={scale}>
        <Tooltip showTitle={false} />
        <Coord type="theta" />
        <Axis />
        <Legend dataKey="tag" />
        <Pie
          position="percent"
          color="tag"
          style={{ stroke: '#fff', lineWidth: 1 }}
          label={['percent', {
            formatter: (val, item) => {
              return item.point.tag + ': ' + val;
            }
          }]}
        />
      </Chart>
    );
  }
}