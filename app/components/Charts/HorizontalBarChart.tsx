import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  scales,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

interface CombinedBarChartProps {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
  six: number;
  seven: number;
  eight: number;
  nine: number;
  ten: number;
}

const CombinedBarChart: React.FC<CombinedBarChartProps> = ({
  one, two, three, four, five, six, seven, eight, nine, ten,
}) => {
  const now = new Date();
  const labels = [];
  for (let i = 0; i < 10; i++) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${month.toLocaleString('default', { month: 'long' })}`);
  }
  labels.reverse();
  const monthlyTransactionCounts = [one, two, three, four, five, six, seven, eight, nine, ten];
  const maxValue = Math.max(...monthlyTransactionCounts) * 1.1;

  const data = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Concluidas',
        data: monthlyTransactionCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        type: 'line' as const,
        label: 'Média',
        data: monthlyTransactionCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        suggestedMax: maxValue,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        }
      },
    },
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default CombinedBarChart;

