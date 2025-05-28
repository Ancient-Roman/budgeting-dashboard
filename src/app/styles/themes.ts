// themes.ts
import Highcharts from 'highcharts';

export const darkTheme: Highcharts.Options = {
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: "'Inter', sans-serif",
    },
  },
  title: {
    style: { color: '#FFFFFF' },
  },
  xAxis: {
    labels: {
      style: { color: '#CCCCCC' },
    },
    gridLineColor: '#444',
    lineColor: '#666',
  },
  yAxis: {
    labels: {
      style: { color: '#CCCCCC' },
    },
    gridLineColor: '#444',
    lineColor: '#666',
    title: {
      style: { color: '#CCCCCC' },
    },
  },
  legend: {
    itemStyle: {
      color: '#FFFFFF',
    },
  },
};

export const lightTheme: Highcharts.Options = {
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: "'Inter', sans-serif",
    },
  },
  title: {
    style: { color: '#1F2937' },
  },
  xAxis: {
    labels: {
      style: { color: '#374151' },
    },
    gridLineColor: '#E5E7EB',
    lineColor: '#D1D5DB',
  },
  yAxis: {
    labels: {
      style: { color: '#374151' },
    },
    gridLineColor: '#E5E7EB',
    lineColor: '#D1D5DB',
    title: {
      style: { color: '#374151' },
    },
  },
  legend: {
    itemStyle: {
      color: '#1F2937',
    },
  },
};
