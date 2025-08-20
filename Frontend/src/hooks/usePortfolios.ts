import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioAPI } from "@/services/apiService";

// Types for MongoDB
interface Portfolio {
  _id: string;
  name: string;
  note?: string;
  baseCurrency: string;
  createdAt: string;
  updatedAt: string;
}

// interface InsertPortfolio {
//   name: string;
//   note?: string;
//   baseCurrency?: string;
// }

// interface UpdatePortfolio {
//   name?: string;
//   note?: string;
//   baseCurrency?: string;
// }

// Function to get all portfolios
export const getPortfolios = async (): Promise<Portfolio[]> => {
  return portfolioAPI.getPortfolios();
};

// Function to add a new portfolio
// export const addPortfolio = async (
//   portfolio: InsertPortfolio
// ): Promise<Portfolio | null> => {
//   // Note: You'll need to add POST endpoint for portfolios
//   const response = await fetch("http://localhost:4000/api/portfolios", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(portfolio),
//   });
//   return response.json();
// };

// // Function to update a portfolio
// export const updatePortfolio = async (
//   id: string,
//   updates: UpdatePortfolio
// ): Promise<Portfolio | null> => {
//   // Note: You'll need to add PUT endpoint for portfolios
//   const response = await fetch(`http://localhost:4000/api/portfolios/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(updates),
//   });
//   return response.json();
// };

// // Function to delete a portfolio
// export const deletePortfolio = async (id: string): Promise<boolean> => {
//   // Note: You'll need to add DELETE endpoint for portfolios
//   const response = await fetch(`http://localhost:4000/api/portfolios/${id}`, {
//     method: "DELETE",
//   });
//   return response.ok;
// };

export const usePortfolios = () => {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
  });
};

// export const useAddPortfolio = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: addPortfolio,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["portfolios"] });
//     },
//   });
// };

// export const useUpdatePortfolio = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, updates }: { id: string; updates: UpdatePortfolio }) =>
//       updatePortfolio(id, updates),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["portfolios"] });
//     },
//   });
// };

// export const useDeletePortfolio = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deletePortfolio,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["portfolios"] });
//       queryClient.invalidateQueries({ queryKey: ["portfolio-holdings"] });
//     },
//   });
// };
