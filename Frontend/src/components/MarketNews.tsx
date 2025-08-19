import { Card } from "@/components/ui/card";
import { ExternalLink, Clock, ChevronRight } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface MarketNewsProps {
  news: NewsItem[];
}

export const MarketNews = ({ news }: MarketNewsProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-profit';
      case 'negative':
        return 'text-loss';
      default:
        return 'text-neutral';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <ChevronRight className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Market News</h2>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {news.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => window.open(item.url, '_blank')}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground text-sm leading-tight pr-2">
                {item.title}
              </h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {item.summary}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">{item.source}</span>
                <span className={`font-medium ${getSentimentColor(item.sentiment)}`}>
                  {item.sentiment}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(item.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};