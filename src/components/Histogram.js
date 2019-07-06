import { Chart, Tooltip, Axis, Bar } from 'viser-react';
import * as React from 'react';

// const data = [
//   { day: '06-25', 活跃度: 38 },
//   { day: '06-26', 活跃度: 52 },
//   { day: '06-27', 活跃度: 61 },
//   { day: '06-28', 活跃度: 145 },
//   { day: '06-29', 活跃度: 48 },
//   { day: '06-30', 活跃度: 38 },
//   { day: '07-01', 活跃度: 38 },
//   { day: '07-02', 活跃度: 38 },
// ];

const scale = [{
  dataKey: '活跃度',
  tickInterval: 20,
}];

export default class Histogram extends React.Component {
  render() {
    const data = this.props.data;
    console.log(data);
    console.log('')
    return (
      <Chart forceFit height={400} data={data} scale={scale}>
        <Tooltip />
        <Axis />
        <Bar position="day*活跃度" />
      </Chart>
    );
  }
}

