import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { MdBorderColor } from 'react-icons/md';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  DRAFT: number;
  PENDING: number;
  ACTIVE: number;
  ON_HOLD: number;
  COMPLETED: number;
  CANCELLED: number;
  FAILED: number;
  REVIEW: number;
}

const PieChart: React.FC<PieChartProps> = ({ DRAFT, PENDING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED, FAILED, REVIEW }) => {
  const total = DRAFT + PENDING + ACTIVE + ON_HOLD + COMPLETED + CANCELLED + FAILED + REVIEW;

  const data = {
    labels: ['Draft', 'Pending', 'Active', 'On Hold', 'Completed', 'Cancelled', 'Failed', 'Review'],
    datasets: [
      {
        label: 'Status Process',
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        data: [DRAFT, PENDING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED, FAILED, REVIEW],
        backgroundColor: [
          'rgba(172, 172, 172, 0.8)',
          'rgba(255, 191, 29, 0.8)',
          'rgba(22, 247, 255, 0.8)',
          'rgba(255, 153, 0, 0.8)',
          'rgba(100, 241, 18, 0.8)',
          'rgba(224, 67, 93, 0.8)',
          'rgba(255, 14, 14, 0.8)',
          'rgba(0, 84, 95, 0.8)',
        ],
        borderColor: [
          'white',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartContainerStyle = {
    width: '400px',
    height: '400px',
    margin: 'auto',
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Total de processos'
      },
      legend: {
        position: 'left',
      },
    },
  };

  return (
    <div style={chartContainerStyle}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PieChart;

