import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { darkTheme, lightTheme } from '@/app/styles/themes';

type PieChartProps = {
  title?: string;
  data: {
    name: string;
    y: number;
  }[];
  isDarkMode?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
    title = 'Pie Chart',
    data,
    isDarkMode = false,
}) => {
    const theme = isDarkMode ? darkTheme : lightTheme;

    const labelColor = isDarkMode ? '#FFFFFF' : '#000000';
  
    const options: Highcharts.Options = {
      chart: {
        type: 'pie',
        backgroundColor: theme.chart?.backgroundColor,
        style: theme.chart?.style,
      },
      title: {
        text: title,
        style: theme.title?.style,
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b><br/>${point.y:.2f}',
        style: theme.tooltip?.style,
        backgroundColor: theme.tooltip?.backgroundColor,
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            color: labelColor,
          },
        },
      },
      series: [
        {
          name: 'Share',
          colorByPoint: true,
          type: 'pie',
          data,
        } as Highcharts.SeriesPieOptions,
      ],
      credits: {
        enabled: false,
      },
    };
  
    return <HighchartsReact highcharts={Highcharts} options={options} />;
};
  
export default PieChart;
