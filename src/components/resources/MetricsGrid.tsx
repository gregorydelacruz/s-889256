
import { Cpu, Server, HardDrive, Network } from "lucide-react";
import MetricCard from "./MetricCard";

interface MetricsGridProps {
  metrics: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
}

const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  const metricCards = [
    {
      title: "CPU Usage",
      value: `${metrics.cpu}%`,
      icon: Cpu,
      color: "rgb(255, 99, 132)",
    },
    {
      title: "Memory Usage",
      value: `${metrics.memory}%`,
      icon: Server,
      color: "rgb(54, 162, 235)",
    },
    {
      title: "Storage Used",
      value: `${metrics.storage}%`,
      icon: HardDrive,
      color: "rgb(75, 192, 192)",
    },
    {
      title: "Network Transfer",
      value: `${metrics.network} MB`,
      icon: Network,
      color: "rgb(153, 102, 255)",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
};

export default MetricsGrid;
