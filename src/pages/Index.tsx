
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarCheck, ChartBar, MessageSquare, Users } from "lucide-react";

const data = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 500 },
  { name: "Thu", value: 280 },
  { name: "Fri", value: 590 },
  { name: "Sat", value: 350 },
  { name: "Sun", value: 400 },
];

const metrics = [
  {
    title: "Total Followers",
    value: "24.5K",
    change: "+12%",
    icon: Users,
  },
  {
    title: "Engagement Rate",
    value: "5.2%",
    change: "+3%",
    icon: ChartBar,
  },
  {
    title: "Scheduled Posts",
    value: "12",
    change: "Active",
    icon: CalendarCheck,
  },
  {
    title: "Comments",
    value: "891",
    change: "+28%",
    icon: MessageSquare,
  },
];

const ScheduledPost = ({ time, title }: { time: string; title: string }) => (
  <div className="flex items-center space-x-4 p-4 hover:bg-secondary/50 rounded-lg transition-colors">
    <div className="text-sm text-muted-foreground w-20">{time}</div>
    <div className="flex-1">
      <p className="text-sm font-medium">{title}</p>
    </div>
  </div>
);

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your social media performance
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="glass-card hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="glass-card col-span-4">
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>
              Last 7 days performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#9b87f5"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Posts</CardTitle>
            <CardDescription>
              Your scheduled content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <ScheduledPost
                time="9:00 AM"
                title="Product Launch Announcement"
              />
              <ScheduledPost
                time="12:30 PM"
                title="Weekly Team Update"
              />
              <ScheduledPost
                time="3:00 PM"
                title="Customer Success Story"
              />
              <ScheduledPost
                time="5:30 PM"
                title="Feature Spotlight"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
