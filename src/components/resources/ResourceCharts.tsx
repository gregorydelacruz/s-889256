
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Metric {
  metric_name: string;
  value: number;
  timestamp: string;
}

interface ResourceChartsProps {
  metrics: Metric[];
}

const ResourceCharts = ({ metrics }: ResourceChartsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      <Card className="glass-card fade-in-element">
        <CardHeader>
          <CardTitle>CPU & Memory Usage</CardTitle>
          <CardDescription>
            Last 24 hours performance
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.filter(m => m.metric_name === 'cpu_usage' || m.metric_name === 'memory_usage')}>
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value"
                name="CPU Usage"
                stroke="rgb(255, 99, 132)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="value"
                name="Memory Usage"
                stroke="rgb(54, 162, 235)" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass-card fade-in-element">
        <CardHeader>
          <CardTitle>Network & Storage Usage</CardTitle>
          <CardDescription>
            Last 24 hours activity
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.filter(m => m.metric_name === 'network_transfer' || m.metric_name === 'storage_usage')}>
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value"
                name="Network Transfer"
                stroke="rgb(153, 102, 255)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="value"
                name="Storage Usage"
                stroke="rgb(75, 192, 192)" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceCharts;
