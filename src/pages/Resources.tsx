
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

const fetchServiceMetrics = async (serviceId: string) => {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('service_id', serviceId)
    .order('timestamp', { ascending: true });
  
  if (error) throw error;
  return data;
};

const Resources = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  const { data: metrics = [], isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['metrics', selectedServiceId],
    queryFn: () => selectedServiceId ? fetchServiceMetrics(selectedServiceId) : Promise.resolve([]),
    enabled: !!selectedServiceId,
  });

  // Set initial selected service
  useEffect(() => {
    if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [services]);

  const currentService = services.find(service => service.id === selectedServiceId);

  const getLatestMetrics = () => {
    const latestMetrics: Record<string, number> = {};
    metrics.forEach(metric => {
      if (!latestMetrics[metric.metric_name] || new Date(metric.timestamp || '') > new Date(latestMetrics[metric.metric_name])) {
        latestMetrics[metric.metric_name] = metric.value;
      }
    });
    return {
      cpu: latestMetrics['cpu_usage'] || 0,
      memory: latestMetrics['memory_usage'] || 0,
      storage: latestMetrics['storage_usage'] || 0,
      network: latestMetrics['network_transfer'] || 0,
    };
  };

  const currentMetrics = getLatestMetrics();

  const metricCards = [
    {
      title: "CPU Usage",
      value: `${currentMetrics.cpu}%`,
      icon: Cpu,
      color: "rgb(255, 99, 132)",
    },
    {
      title: "Memory Usage",
      value: `${currentMetrics.memory}%`,
      icon: Server,
      color: "rgb(54, 162, 235)",
    },
    {
      title: "Storage Used",
      value: `${currentMetrics.storage}%`,
      icon: HardDrive,
      color: "rgb(75, 192, 192)",
    },
    {
      title: "Network Transfer",
      value: `${currentMetrics.network} MB`,
      icon: Network,
      color: "rgb(153, 102, 255)",
    },
  ];

  if (isLoadingServices) {
    return <div className="p-8">Loading services...</div>;
  }

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
        <Select value={selectedServiceId || ''} onValueChange={setSelectedServiceId}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Services</SelectLabel>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {currentService && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metricCards.map((metric) => (
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

          <Card className="glass-card mt-6 fade-in-element">
            <CardHeader>
              <CardTitle>Resource Alerts</CardTitle>
              <CardDescription>
                Recent system notifications for {currentService.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-yellow-500/10 rounded-lg">
                  <Database className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Storage space running low</p>
                    <p className="text-xs text-muted-foreground">{currentService.name} - 85% capacity reached</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg">
                  <Cpu className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">CPU usage normalized</p>
                    <p className="text-xs text-muted-foreground">{currentService.name} - Back to normal levels</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Resources;
