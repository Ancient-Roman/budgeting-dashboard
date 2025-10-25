import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { darkTheme, lightTheme } from '@/app/styles/themes';

export interface BarChartProps {
  title?: string;
  series?: {type: string; name: string; color?: string; data?: { name: string; y: number; }[] }[];
  isDarkMode?: boolean;
}
export interface BarChartProps {
  title?: string;
  series?: {type: string; name: string; color?: string; data?: { name: string; y: number; }[] }[];
  isDarkMode?: boolean;
  tooltipFormatter?: Highcharts.TooltipFormatterCallbackFunction;
  legendEnabled?: boolean;
}
const BarChart: React.FC<BarChartProps> = ({ title = 'Bar Chart', series, tooltipFormatter, isDarkMode = false, legendEnabled = false }) => {
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
      labels: Array.isArray(theme.xAxis) ? undefined : theme.xAxis?.labels,
      lineColor: Array.isArray(theme.xAxis) ? undefined : theme.xAxis?.lineColor,
      tickColor: Array.isArray(theme.xAxis) ? undefined : theme.xAxis?.tickColor,
      allowDecimals: false,
    },
    yAxis: {
      min: undefined,
      title: {
        text: "",
        style: !Array.isArray(theme.yAxis) ? theme.yAxis?.title?.style : undefined,
      },
      labels: !Array.isArray(theme.yAxis) ? theme.yAxis?.labels : undefined,
      gridLineColor: !Array.isArray(theme.yAxis) ? theme.yAxis?.gridLineColor : undefined,
      allowDecimals: false,
    },
    tooltip: {
      valueSuffix: '',
      backgroundColor: theme.tooltip?.backgroundColor,
      style: theme.tooltip?.style,
      formatter: tooltipFormatter 
        ? tooltipFormatter 
        : function () {
          return `<b>${this.name}</b><br/>` +
            `${this.series.name}: $${this.y?.toFixed(2)}`;
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
    legend: {
      enabled: legendEnabled,
      itemStyle: {
        color: isDarkMode ? '#e2e8f0' : '#000000',
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
