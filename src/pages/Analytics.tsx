import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout";
import { siteData, getAllTopics } from "@/data/siteData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Color palette matching the site's design
const TOPIC_COLORS: Record<string, string> = {
  "Social Computing": "hsl(221, 83%, 53%)",
  "Mobile HCI": "hsl(262, 83%, 58%)",
  "Accessibility": "hsl(142, 76%, 36%)",
  "AI/ML": "hsl(24, 95%, 53%)",
  "Information Visualization": "hsl(346, 77%, 50%)",
};

const getTopicColor = (topic: string, index: number) => {
  if (TOPIC_COLORS[topic]) return TOPIC_COLORS[topic];
  // Fallback colors
  const fallbackColors = [
    "hsl(199, 89%, 48%)",
    "hsl(280, 65%, 60%)",
    "hsl(160, 60%, 45%)",
    "hsl(45, 93%, 47%)",
    "hsl(330, 70%, 50%)",
  ];
  return fallbackColors[index % fallbackColors.length];
};

const Analytics = () => {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  // Process data: group publications by year and topic
  const { chartData, topics, years } = useMemo(() => {
    const allTopics = getAllTopics();
    const yearTopicCount: Record<number, Record<string, number>> = {};

    // Count publications per year per topic
    siteData.publications.forEach((pub) => {
      const year = pub.year;
      if (!yearTopicCount[year]) {
        yearTopicCount[year] = {};
      }
      pub.topics.forEach((topic) => {
        yearTopicCount[year][topic] = (yearTopicCount[year][topic] || 0) + 1;
      });
    });

    // Get all years and sort them
    const allYears = Object.keys(yearTopicCount)
      .map(Number)
      .sort((a, b) => a - b);

    // Create chart data
    const data = allYears.map((year) => {
      const entry: Record<string, number | string> = { year: year.toString() };
      allTopics.forEach((topic) => {
        entry[topic] = yearTopicCount[year]?.[topic] || 0;
      });
      return entry;
    });

    return { chartData: data, topics: allTopics, years: allYears };
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-heading font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            {sortedPayload.map((entry: any) => (
              entry.value > 0 && (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground">{entry.name}:</span>
                  <span className="font-medium text-foreground">{entry.value} papers</span>
                </div>
              )
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry: any, index: number) => (
          <button
            key={entry.value}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200 ${
              hoveredTopic === null || hoveredTopic === entry.value
                ? "opacity-100"
                : "opacity-40"
            }`}
            onMouseEnter={() => setHoveredTopic(entry.value)}
            onMouseLeave={() => setHoveredTopic(null)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-foreground">{entry.value}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-heading font-bold text-center mb-2">Analytics</h1>
      <p className="text-center text-muted-foreground mb-8">
        An analysis of research topics across my papers
      </p>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-heading font-bold text-primary">
            {siteData.publications.length}
          </p>
          <p className="text-sm text-muted-foreground">Total Publications</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-heading font-bold text-primary">
            {topics.length}
          </p>
          <p className="text-sm text-muted-foreground">Research Topics</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-heading font-bold text-primary">
            {years[years.length - 1] - years[0] + 1}
          </p>
          <p className="text-sm text-muted-foreground">Years Active</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6 mt-8">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="year"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              {topics.map((topic, index) => (
                <Line
                  key={topic}
                  type="monotone"
                  dataKey={topic}
                  stroke={getTopicColor(topic, index)}
                  strokeWidth={hoveredTopic === null || hoveredTopic === topic ? 2.5 : 1.5}
                  strokeOpacity={hoveredTopic === null || hoveredTopic === topic ? 1 : 0.2}
                  dot={{
                    fill: getTopicColor(topic, index),
                    strokeWidth: 0,
                    r: hoveredTopic === null || hoveredTopic === topic ? 4 : 2,
                    opacity: hoveredTopic === null || hoveredTopic === topic ? 1 : 0.2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: getTopicColor(topic, index),
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                  }}
                  onMouseEnter={() => setHoveredTopic(topic)}
                  onMouseLeave={() => setHoveredTopic(null)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
