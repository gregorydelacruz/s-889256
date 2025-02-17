
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ChevronLeft, Cpu, Database, HardDrive, Network, Server } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serverData = [
  {
    name: "Production Server",
    metrics: {
      cpu: "65%",
      memory: "8.2GB",
      storage: "456GB",
      network: "1.2TB",
    },
    usage: [
      { time: "00:00", cpu: 45, memory: 62, network: 30, storage: 75 },
      { time: "04:00", cpu: 55, memory: 65, network: 35, storage: 75 },
      { time: "08:00", cpu: 75, memory: 75, network: 45, storage: 76 },
      { time: "12:00", cpu: 85, memory: 85, network: 55, storage: 77 },
      { time: "16:00", cpu: 65, memory: 72, network: 40, storage: 77 },
      { time: "20:00", cpu: 50, memory: 68, network: 35, storage: 78 },
      { time: "24:00", cpu: 45, memory: 65, network: 30, storage: 78 },
    ]
  },
  {
    name: "Development Server",
    metrics: {
      cpu: "45%",
      memory: "4.8GB",
      storage: "234GB",
      network: "0.8TB",
    },
    usage: [
      { time: "00:00", cpu: 35, memory: 52, network: 20, storage: 45 },
      { time: "04:00", cpu: 45, memory: 55, network: 25, storage: 45 },
      { time: "08:00", cpu: 55, memory: 65, network: 35, storage: 46 },
      { time: "12:00", cpu: 65, memory: 75, network: 45, storage: 47 },
      { time: "16:00", cpu: 45, memory: 62, network: 30, storage: 47 },
      { time: "20:00", cpu: 40, memory: 58, network: 25, storage: 48 },
      { time: "24:00", cpu: 35, memory: 55, network: 20, storage: 48 },
    ]
  }
];

const Resources = () => {
  const [selectedServer, setSelectedServer] = useState(serverData[0].name);
  const currentServer = serverData.find(server => server.name === selectedServer) || serverData[0];

  const metrics = [
    {
      title: "CPU Usage",
      value: currentServer.metrics.cpu,
      icon: Cpu,
      color: "rgb(255, 99, 132)",
    },
    {
      title: "Memory Usage",
      value: currentServer.metrics.memory,
      icon: Server,
      color: "rgb(54, 162, 235)",
    },
    {
      title: "Storage Used",
      value: currentServer.metrics.storage,
      icon: HardDrive,
      color: "rgb(75, 192, 192)",
    },
    {
      title: "Network Transfer",
      value: currentServer.metrics.network,
      icon: Network,
      color: "rgb(153, 102, 255)",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <header className="mb-8">
        <Link to="/" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-4">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">Resource Monitor</h1>
        <p className="text-muted-foreground mt-2">
          Track server and infrastructure resources
        </p>
      </header>

      <div className="mb-6">
        <Select value={selectedServer} onValueChange={setSelectedServer}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select server" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Servers</SelectLabel>
              {serverData.map((server) => (
                <SelectItem key={server.name} value={server.name}>
                  {server.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="glass-card hover-scale fade-in-element">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <LineChart data={currentServer.usage}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="rgb(255, 99, 132)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
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
              <LineChart data={currentServer.usage}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="network" 
                  stroke="rgb(153, 102, 255)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="storage" 
                  stroke="rgb(75, 192, 192)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card mt-6 fade-in-element">
        <CardHeader>
          <CardTitle>Resource Alerts</CardTitle>
          <CardDescription>
            Recent system notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-yellow-500/10 rounded-lg">
              <Database className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Storage space running low</p>
                <p className="text-xs text-muted-foreground">Production Server - 85% capacity reached</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg">
              <Cpu className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">CPU usage normalized</p>
                <p className="text-xs text-muted-foreground">Development Server - Back to normal levels</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;
