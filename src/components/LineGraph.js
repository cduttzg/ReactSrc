import { Chart, Tooltip, Axis, Line, Point } from 'viser-react';
import * as React from 'react';

// const data = [
//   { day: '06-25', 交易量: 3 },
//   { day: '06-26', 交易量: 4 },
//   { day: '06-27', 交易量: 3.5 },
//   { day: '06-28', 交易量: 5 },
//   { day: '06-29', 交易量: 4.9 },
//   { day: '06-30', 交易量: 6 },
//   { day: '07-01', 交易量: 7 }
// ];

const scale = [{
  dataKey: '交易量',
  min: 0,
},{
  dataKey: 'day',
  min: 0,
  max: 1,
}];

export default class LineGraph extends React.Component {
  render() {
    const data = this.props['data'];
    console.log(data);
    return (
      <Chart forceFit height={400} data={data} scale={scale}>
        <Tooltip />
        <Axis />
        <Line position="day*交易量" />
        <Point position="day*交易量" shape="circle"/>
      </Chart>
    );
  }
}
