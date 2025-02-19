import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarCheck, ChartBar, Globe, MessageSquare, Share2, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const websiteData = [
  {
    name: "Website 1",
    data: [
      { name: "Mon", value: 400 },
      { name: "Tue", value: 300 },
      { name: "Wed", value: 500 },
      { name: "Thu", value: 280 },
      { name: "Fri", value: 590 },
      { name: "Sat", value: 350 },
      { name: "Sun", value: 400 },
    ],
    metrics: {
      visitors: "24.5K",
      bounce: "45%",
      duration: "2m 30s",
      shares: "891",
    }
  },
  {
    name: "Website 2",
    data: [
      { name: "Mon", value: 300 },
      { name: "Tue", value: 450 },
      { name: "Wed", value: 320 },
      { name: "Thu", value: 500 },
      { name: "Fri", value: 420 },
      { name: "Sat", value: 380 },
      { name: "Sun", value: 450 },
    ],
    metrics: {
      visitors: "18.2K",
      bounce: "38%",
      duration: "3m 15s",
      shares: "654",
    }
  }
];

const socialData = [
  {
    platform: "Twitter",
    metrics: {
      followers: "24.5K",
      engagement: "5.2%",
      posts: "12",
      interactions: "891",
    }
  },
  {
    platform: "LinkedIn",
    metrics: {
      followers: "12.8K",
      engagement: "4.8%",
      posts: "8",
      interactions: "567",
    }
  },
  {
    platform: "Instagram",
    metrics: {
      followers: "35.2K",
      engagement: "6.5%",
      posts: "15",
      interactions: "1.2K",
    }
  }
];

const ScheduledPost = ({ time, title, platform }: { time: string; title: string; platform?: string }) => (
  <div className="flex items-center space-x-4 p-4 hover:bg-secondary/50 rounded-lg transition-colors">
    <div className="text-sm text-muted-foreground w-20">{time}</div>
    <div className="flex-1">
      <p className="text-sm font-medium">{title}</p>
      {platform && (
        <p className="text-xs text-muted-foreground">{platform}</p>
      )}
    </div>
  </div>
);

const Index = () => {
  const [selectedWebsite, setSelectedWebsite] = useState(websiteData[0].name);
  const [selectedPlatform, setSelectedPlatform] = useState(socialData[0].platform);

  const currentWebsite = websiteData.find(web => web.name === selectedWebsite) || websiteData[0];
  const currentPlatform = socialData.find(social => social.platform === selectedPlatform) || socialData[0];

  const websiteMetrics = [
    {
      title: "Total Visitors",
      value: currentWebsite.metrics.visitors,
      change: "+12%",
      icon: Users,
    },
    {
      title: "Bounce Rate",
      value: currentWebsite.metrics.bounce,
      change: "-3%",
      icon: ChartBar,
    },
    {
      title: "Avg. Duration",
      value: currentWebsite.metrics.duration,
      change: "+15%",
      icon: CalendarCheck,
    },
    {
      title: "Total Shares",
      value: currentWebsite.metrics.shares,
      change: "+28%",
      icon: Share2,
    },
  ];

  const socialMetrics = [
    {
      title: "Followers",
      value: currentPlatform.metrics.followers,
      change: "+12%",
      icon: Users,
    },
    {
      title: "Engagement Rate",
      value: currentPlatform.metrics.engagement,
      change: "+3%",
      icon: ChartBar,
    },
    {
      title: "Active Posts",
      value: currentPlatform.metrics.posts,
      change: "Active",
      icon: CalendarCheck,
    },
    {
      title: "Interactions",
      value: currentPlatform.metrics.interactions,
      change: "+28%",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your websites and social media performance
          </p>
        </div>
        <Link 
          to="/resources" 
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
        >
          View Resources
        </Link>
      </header>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Website Analytics
        </h2>
        <div className="mb-4">
          <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Websites</SelectLabel>
                {websiteData.map((website) => (
                  <SelectItem key={website.name} value={website.name}>
                    {website.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {websiteMetrics.map((metric) => (
            <Card key={metric.title} className="glass-card hover-scale fade-in-element">
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

        <div className="mt-6">
          <Card className="glass-card fade-in-element">
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>
                Last 7 days website traffic
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentWebsite.data}
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
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Social Media Impact
        </h2>
        <div className="mb-4">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Platforms</SelectLabel>
                {socialData.map((platform) => (
                  <SelectItem key={platform.platform} value={platform.platform}>
                    {platform.platform}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {socialMetrics.map((metric) => (
            <Card key={metric.title} className="glass-card hover-scale fade-in-element">
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

        <Card className="glass-card mt-6 fade-in-element">
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
            <CardDescription>
              Upcoming content across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <ScheduledPost
                time="9:00 AM"
                title="Product Launch Announcement"
                platform="Twitter"
              />
              <ScheduledPost
                time="12:30 PM"
                title="Company Blog Post Share"
                platform="LinkedIn"
              />
              <ScheduledPost
                time="3:00 PM"
                title="Behind the Scenes"
                platform="Instagram"
              />
              <ScheduledPost
                time="5:30 PM"
                title="Feature Spotlight"
                platform="Twitter"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
