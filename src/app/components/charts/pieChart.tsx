// PieChart.tsx
import React, { useEffect } from 'react';
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

const PieChart: React.FC<PieChartProps> = ({ title = 'Pie Chart', data, isDarkMode }) => {
    useEffect(() => {
        // Dynamically apply theme based on dark mode
        Highcharts.setOptions(isDarkMode ? darkTheme : lightTheme);
    }, [isDarkMode]);

    const labelColor = isDarkMode ? '#FFFFFF' : '#000000';
      
    const options: Highcharts.Options = {
        chart: {
            type: 'pie',
        },
        title: {
            text: title,
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
                data: data,
            } as Highcharts.SeriesPieOptions,
        ],
        credits: {
            enabled: false,
        },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
