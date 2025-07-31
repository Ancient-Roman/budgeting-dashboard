import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { darkTheme, lightTheme } from '@/app/styles/themes';

export interface BarChartProps {
  title?: string;
  series?: {type: string; name: string; color?: string; data?: { name: string; y: number; }[] }[];
  isDarkMode?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ title = 'Bar Chart', series, isDarkMode = false }) => {
  // Merge base options with theme options
  const theme = isDarkMode ? darkTheme : lightTheme;

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: theme.chart?.backgroundColor,
      style: theme.chart?.style,
    },
    title: {
      text: title,
      style: theme.title?.style,
    },
    xAxis: {
      type: 'category',
      title: {
        text: null,
      },
      labels: theme.xAxis?.labels,
      lineColor: theme.xAxis?.lineColor,
      tickColor: theme.xAxis?.tickColor,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Values',
        align: 'high',
        style: theme.yAxis?.title.style,
      },
      labels: theme.yAxis?.labels,
      gridLineColor: theme.yAxis?.gridLineColor,
      overflow: 'justify',
    },
    tooltip: {
      valueSuffix: '',
      backgroundColor: theme.tooltip?.backgroundColor,
      style: theme.tooltip?.style,
      formatter: function () {
        return `<b>${this.name}</b><br/>` +
          `$${this.y?.toFixed(2)}`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          style: {
            color: isDarkMode ? '#e2e8f0' : '#000000',
          },
        },
      },
    },
    series: series as Highcharts.SeriesOptionsType[],
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChart;
