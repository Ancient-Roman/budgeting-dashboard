// themes.ts
import Highcharts from 'highcharts';

export const lightTheme: Highcharts.Options = {
  chart: {
    style: {
      color: '#000000',
    },
  },
  title: {
    style: {
      color: '#6d28d9', // purple-700
      fontWeight: 'bold',
      fontSize: '2rem',
      textShadow: '0 2px 8px rgba(109,40,217,0.15)',
      background: 'linear-gradient(90deg, #38bdf8 0%, #a78bfa 50%, #f472b6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  xAxis: {
    labels: {
      style: {
        color: '#000000',
      },
    },
    lineColor: '#ccc',
    tickColor: '#ccc',
  },
  yAxis: {
    labels: {
      style: {
        color: '#000000',
      },
    },
    gridLineColor: '#e6e6e6',
    title: {
      style: {
        color: '#000000',
      },
    },
  },
  tooltip: {
    backgroundColor: '#f0f0f0',
    style: {
      color: '#000000',
    },
  },
};

export const darkTheme: Highcharts.Options = {
  chart: {
    style: {
      color: '#e2e8f0', // slate-300 light text
    },
  },
  title: {
    style: {
      color: '#a78bfa', // purple-400
      fontWeight: 'bold',
      fontSize: '2rem',
      textShadow: '0 2px 8px rgba(167,139,250,0.25)',
      background: 'linear-gradient(90deg, #38bdf8 0%, #a78bfa 50%, #f472b6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  xAxis: {
    labels: {
      style: {
        color: '#cbd5e1', // slate-400
      },
    },
    lineColor: '#334155', // slate-700
    tickColor: '#334155',
  },
  yAxis: {
    labels: {
      style: {
        color: '#cbd5e1',
      },
    },
    gridLineColor: '#475569', // slate-600
    title: {
      style: {
        color: '#cbd5e1',
      },
    },
  },
  tooltip: {
    backgroundColor: '#334155',
    style: {
      color: '#e2e8f0',
    },
  },
};