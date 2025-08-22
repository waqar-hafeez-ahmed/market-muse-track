// src/data/portfolios.ts
import { TrendingUp, Briefcase, Zap, PieChart, Target } from "lucide-react";

export type Portfolio = {
  id: string; // backend Mongo ID
  path: string; // frontend route
  value: string; // "$60K"
  name: string; // "Growth Portfolio"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
};

export const portfolios: Portfolio[] = [
  {
    id: "68a45b0f1ec49f52c1f0c81f",
    path: "/portfolio/68a45b0f1ec49f52c1f0c81f",
    value: "$60K",
    name: "Growth Portfolio",
    icon: TrendingUp,
  },
  {
    id: "68a45b0f1ec49f52c1f0c820",
    path: "/portfolio/68a45b0f1ec49f52c1f0c820",
    value: "$40K",
    name: "Conservative Portfolio",
    icon: Briefcase,
  },
  {
    id: "68a45b0f1ec49f52c1f0c821",
    path: "/portfolio/68a45b0f1ec49f52c1f0c821",
    value: "$25K",
    name: "Tech Focus Portfolio",
    icon: Zap,
  },
  {
    id: "68a45b0f1ec49f52c1f0c822",
    path: "/portfolio/68a45b0f1ec49f52c1f0c822",
    value: "$11K",
    name: "Dividend Portfolio",
    icon: PieChart,
  },
  {
    id: "68a45b0f1ec49f52c1f0c823",
    path: "/portfolio/68a45b0f1ec49f52c1f0c823",
    value: "$1K",
    name: "Speculative Portfolio",
    icon: Target,
  },
];
// helpers
export const getPortfolioById = (id?: string) =>
  portfolios.find((p) => p.id === id);
export const DEFAULT_PORTFOLIO_ID = portfolios[0].id;
