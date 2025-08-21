/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { useAddHolding } from "@/hooks/usePortfolio";

export function AddTransactionForm({
  portfolioId = "68a45b0f1ec49f52c1f0c81f",
  defaultAssetType = "stock",
  onSuccess,
}: {
  portfolioId?: string;
  defaultAssetType?: "stock" | "crypto";
  onSuccess?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [assetType, setAssetType] = useState<"stock" | "crypto">(
    defaultAssetType
  );
  const [action, setAction] = useState<"BUY" | "SELL">("BUY");
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [fee, setFee] = useState("0");
  const [note, setNote] = useState("");

  const addTx = useAddHolding();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !quantity || !price) {
      toast.error("Symbol, Quantity and Price are required");
      return;
    }

    try {
      await addTx.mutateAsync({
        portfolioId,
        assetType,
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase(), // ✅ make sure name is passed
        action, // backend expects uppercase
        shares: Number(quantity),
        avgCost: Number(price),
      });

      setIsExpanded(false);
      setSymbol("");
      setQuantity("");
      setPrice("");
      setFee("0");
      setNote("");
      toast.success(`${action} added`);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add transaction");
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
            Add Transaction
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Asset Type</Label>
              <select
                className="w-full h-10 rounded-md border bg-background px-3"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as any)}
              >
                <option value="stock">Stock</option>
                <option value="crypto">Crypto</option>
                <option value="forex">Forex</option>
              </select>
            </div>
            <div>
              <Label>Action</Label>
              <select
                className="w-full h-10 rounded-md border bg-background px-3"
                value={action}
                onChange={(e) => setAction(e.target.value as any)}
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="AAPL / BTC"
                className="uppercase"
              />
            </div>
            <div>
              <Label htmlFor="qty">Quantity</Label>
              <Input
                id="qty"
                type="number"
                step="0.00000001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.00000001"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fee">Fee (optional)</Label>
              <Input
                id="fee"
                type="number"
                step="0.01"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={addTx.isPending}>
              {addTx.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Save
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
}
