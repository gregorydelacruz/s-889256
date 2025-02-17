
import { Cpu, Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResourceAlertsProps {
  serviceName: string;
}

const ResourceAlerts = ({ serviceName }: ResourceAlertsProps) => {
  return (
    <Card className="glass-card mt-6 fade-in-element">
      <CardHeader>
        <CardTitle>Resource Alerts</CardTitle>
        <CardDescription>
          Recent system notifications for {serviceName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-yellow-500/10 rounded-lg">
            <Database className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Storage space running low</p>
              <p className="text-xs text-muted-foreground">{serviceName} - 85% capacity reached</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg">
            <Cpu className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">CPU usage normalized</p>
              <p className="text-xs text-muted-foreground">{serviceName} - Back to normal levels</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceAlerts;
