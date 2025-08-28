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
    value: "$50K",
    name: "Crypto Portfolio - $50K",
    icon: TrendingUp,
  },
  {
    id: "68a45b0f1ec49f52c1f0c820",
    path: "/portfolio/68a45b0f1ec49f52c1f0c820",
    value: "$55K",
    name: "Stocks Portfolio - $55K",
    icon: Briefcase,
  },
  {
    id: "68a45b0f1ec49f52c1f0c821",
    path: "/portfolio/68a45b0f1ec49f52c1f0c821",
    value: "$35K",
    name: "Crypto Portfolio - $35K",
    icon: Zap,
  },
  {
    id: "68a45b0f1ec49f52c1f0c822",
    path: "/portfolio/68a45b0f1ec49f52c1f0c822",
    value: "$15K",
    name: "Crypto Portfolio - $15K",
    icon: PieChart,
  },
];
// helpers
export const getPortfolioById = (id?: string) =>
  portfolios.find((p) => p.id === id);
export const DEFAULT_PORTFOLIO_ID = portfolios[0].id;
