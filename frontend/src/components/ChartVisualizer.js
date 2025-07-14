import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartVisualizer = ({ excelData }) => {
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [columns, setColumns] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [is3D, setIs3D] = useState(false);

  // Extract column headers when excelData changes
  useEffect(() => {
    if (excelData && excelData.length > 0) {
      const headers = Object.keys(excelData[0]);
      setColumns(headers);
      
      // Set default axes if not already set
      if (!xAxis && headers.length > 0) setXAxis(headers[0]);
      if (!yAxis && headers.length > 1) setYAxis(headers[1]);
    }
  }, [excelData, xAxis, yAxis]);

  // Prepare chart data when axes or chart type changes
  useEffect(() => {
    if (excelData && excelData.length > 0 && xAxis && yAxis) {
      const labels = excelData.map(row => row[xAxis]);
      const data = excelData.map(row => row[yAxis]);
      
      const datasetConfig = {
        label: yAxis,
        data: data,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      };
      
      setChartData({
        labels,
        datasets: [datasetConfig],
      });
    }
  }, [excelData, xAxis, yAxis, chartType]);

  // Render 3D chart using Three.js
  const ThreeDChart = () => {
    if (!chartData) return null;
    
    return (
      <div style={{ height: '400px', width: '100%' }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <OrbitControls />
          {chartData.labels.map((label, index) => {
            const value = chartData.datasets[0].data[index];
            const normalizedValue = value / Math.max(...chartData.datasets[0].data) * 5;
            return (
              <mesh key={index} position={[index - chartData.labels.length / 2, normalizedValue / 2, 0]}>
                <boxGeometry args={[0.8, normalizedValue || 0.1, 0.8]} />
                <meshStandardMaterial color="royalblue" />
                <mesh position={[0, -normalizedValue / 2 - 0.5, 0]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshStandardMaterial color="white" />
                </mesh>
              </mesh>
            );
          })}
        </Canvas>
      </div>
    );
  };

  // Render 2D chart based on selected chart type
  const renderChart = () => {
    if (!chartData) return null;
    
    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `${yAxis} vs ${xAxis}`,
        },
      },
    };
    
    switch (chartType) {
      case 'line':
        return <Line options={options} data={chartData} />;
      case 'bar':
        return <Bar options={options} data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      case 'scatter':
        return <Scatter options={options} data={chartData} />;
      default:
        return <Bar options={options} data={chartData} />;
    }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h3>📊 Data Visualization</h3>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="xAxis">X-Axis: </label>
          <select 
            id="xAxis"
            value={xAxis} 
            onChange={(e) => setXAxis(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', marginLeft: '5px' }}
          >
            {columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="yAxis">Y-Axis: </label>
          <select 
            id="yAxis"
            value={yAxis} 
            onChange={(e) => setYAxis(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', marginLeft: '5px' }}
          >
            {columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="chartType">Chart Type: </label>
          <select 
            id="chartType"
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', marginLeft: '5px' }}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="dimension">Dimension: </label>
          <select 
            id="dimension"
            value={is3D ? '3d' : '2d'} 
            onChange={(e) => setIs3D(e.target.value === '3d')}
            style={{ padding: '8px', borderRadius: '5px', marginLeft: '5px' }}
          >
            <option value="2d">2D</option>
            <option value="3d">3D</option>
          </select>
        </div>
      </div>
      
      <div style={{ height: '400px', marginTop: '20px' }}>
        {is3D ? <ThreeDChart /> : renderChart()}
      </div>
    </div>
  );
};

export default ChartVisualizer;