
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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
import MetricsGrid from "@/components/resources/MetricsGrid";
import ResourceCharts from "@/components/resources/ResourceCharts";
import ResourceAlerts from "@/components/resources/ResourceAlerts";
import { useToast } from "@/hooks/use-toast";

const fetchServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
  return data;
};

const fetchServiceMetrics = async (serviceId: string) => {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('service_id', serviceId)
    .order('timestamp', { ascending: true });
  
  if (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
  return data;
};

const Resources = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: services = [], isLoading: isLoadingServices, error: servicesError } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
    refetchInterval: 30000, // Refetch services list every 30 seconds
  });

  const { data: metrics = [], isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['metrics', selectedServiceId],
    queryFn: () => selectedServiceId ? fetchServiceMetrics(selectedServiceId) : Promise.resolve([]),
    enabled: !!selectedServiceId,
    refetchInterval: 10000, // Refetch metrics every 10 seconds
  });

  // Subscribe to real-time updates for metrics
  useEffect(() => {
    if (!selectedServiceId) return;

    const channel = supabase
      .channel('metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'metrics',
          filter: `service_id=eq.${selectedServiceId}`
        },
        () => {
          // Manually trigger a refetch when we receive a real-time update
          void fetchServiceMetrics(selectedServiceId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedServiceId]);

  useEffect(() => {
    if (servicesError) {
      toast({
        title: "Error",
        description: "Failed to load services. Please try again later.",
        variant: "destructive",
      });
    }
  }, [servicesError, toast]);

  // Set initial selected service
  useEffect(() => {
    if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [services]);

  const currentService = services.find(service => service.id === selectedServiceId);

  const getLatestMetrics = () => {
    if (metrics.length === 0) return {
      cpu: 0,
      memory: 0,
      storage: 0,
      network: 0,
    };

    const latestMetrics: Record<string, number> = {};
    metrics.forEach(metric => {
      if (!latestMetrics[metric.metric_name] || 
          new Date(metric.timestamp || '') > new Date(latestMetrics[metric.metric_name])) {
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
          <MetricsGrid metrics={getLatestMetrics()} />
          <ResourceCharts metrics={metrics} />
          <ResourceAlerts serviceName={currentService.name} />
        </>
      )}
    </div>
  );
};

export default Resources;
