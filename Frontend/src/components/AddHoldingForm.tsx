import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAddHolding } from "@/hooks/usePortfolio";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

interface AddHoldingFormProps {
  portfolioId?: string;
  onSuccess?: () => void;
}

export const AddHoldingForm = ({
  portfolioId = "68a45b0f1ec49f52c1f0c81f",
  onSuccess,
}: AddHoldingFormProps) => {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [shares, setShares] = useState("");
  const [avgCost, setAvgCost] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const addHolding = useAddHolding();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol || !name || !shares || !avgCost) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addHolding.mutateAsync({
        symbol: symbol.toUpperCase(),
        name,
        shares: parseFloat(shares),
        avg_cost: parseFloat(avgCost),
        portfolio_id: portfolioId,
      });

      // Reset form
      setSymbol("");
      setName("");
      setShares("");
      setAvgCost("");
      setIsExpanded(false);

      toast.success("Holding added successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to add holding");
    }
  };

  if (!isExpanded) {
    return (
      <Card>
        <CardContent className="p-6">
          <Button
            onClick={() => setIsExpanded(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Holding
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Holding</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="AAPL"
                className="uppercase"
              />
            </div>
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Apple Inc."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shares">Number of Shares</Label>
              <Input
                id="shares"
                type="number"
                step="0.001"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="avgCost">Average Cost per Share</Label>
              <Input
                id="avgCost"
                type="number"
                step="0.01"
                value={avgCost}
                onChange={(e) => setAvgCost(e.target.value)}
                placeholder="150.00"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={addHolding.isPending}>
              {addHolding.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Add Holding
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
