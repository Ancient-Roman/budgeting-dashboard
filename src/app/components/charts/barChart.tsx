import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { darkTheme, lightTheme } from '@/app/styles/themes';

export interface BarChartProps {
  title?: string;
  series?: {type: string; name: string; color?: string; data?: { name: string; y: number; }[] }[];
  isDarkMode?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ title = 'Bar Chart', series, isDarkMode = false }) => {
  useEffect(() => {
    // Dynamically apply theme based on dark mode
    Highcharts.setOptions(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
    },
    title: {
      text: title,
    },
    xAxis: {
      type: 'category',
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Values',
        align: 'high',
      },
      labels: {
        overflow: 'justify',
      },
    },
    tooltip: {
      valueSuffix: '',
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    series,
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
