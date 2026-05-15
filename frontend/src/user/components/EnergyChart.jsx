import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { useAppContext } from "../../context/AppContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function EnergyChart({ data: externalData }) {

  const { usageLogs } = useAppContext();

  const logs = externalData && externalData.length > 0
    ? externalData
    : usageLogs;

  const chartData = useMemo(() => {
    const energyMap = {};

    logs.forEach((log) => {
      if (!energyMap[log.applianceName]) {
        energyMap[log.applianceName] = 0;
      }

      energyMap[log.applianceName] += Number(log.energy);
    });

    return {
      labels: Object.keys(energyMap),
      datasets: [
        {
          label: "Energy Consumption (kWh)",
          data: Object.values(energyMap),
          backgroundColor: "#3b82f6",
          hoverBackgroundColor: "#2563eb",
          borderRadius: 6
        }
      ]
    };
  }, [logs]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      rounded-xl p-6 shadow-sm"
    >

      <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
        Energy Usage by Appliance
      </h2>

      {logs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No usage data available
        </p>
      ) : (

        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>

      )}

    </div>
  );
}

export default EnergyChart;