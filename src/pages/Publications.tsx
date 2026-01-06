import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { PublicationCard } from "@/components/cards/PublicationCard";
import { filterPublications, getAllTopics, getAllTypes, getPublicationsByYear } from "@/data/siteData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Publications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTopic = searchParams.get("topic") || "All";
  const selectedType = searchParams.get("type") || "All";

  const topics = ["All", ...getAllTopics()];
  const types = ["All", ...getAllTypes()];

  const handleTopicChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "All") {
      newParams.delete("topic");
    } else {
      newParams.set("topic", value);
    }
    setSearchParams(newParams);
  };

  const handleTypeChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "All") {
      newParams.delete("type");
    } else {
      newParams.set("type", value);
    }
    setSearchParams(newParams);
  };

  // Filter and group publications
  const filtered = filterPublications(selectedTopic, selectedType);
  const grouped: Record<number, typeof filtered> = {};
  filtered.forEach((pub) => {
    if (!grouped[pub.year]) grouped[pub.year] = [];
    grouped[pub.year].push(pub);
  });
  const sortedYears = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <MainLayout>
      <h1 className="text-3xl font-heading font-bold text-center mb-8">Publications</h1>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Research Topic</label>
          <Select value={selectedTopic} onValueChange={handleTopicChange}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Publication Type</label>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Publications by Year */}
      {sortedYears.map((year) => (
        <section key={year} className="mb-10">
          <h2 className="year-badge mb-4">{year}</h2>
          <div className="divide-y divide-border">
            {grouped[year].map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        </section>
      ))}

      {sortedYears.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No publications found matching the selected filters.
        </p>
      )}
    </MainLayout>
  );
};

export default Publications;
