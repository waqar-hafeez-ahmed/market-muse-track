import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePortfolios } from "@/hooks/usePortfolios"
import { usePortfolioSummary } from "@/hooks/usePortfolio"
import { TrendingUp, TrendingDown, Eye } from "lucide-react"
import { Link } from "react-router-dom"

const PortfolioCard = ({ portfolio }: { portfolio: any }) => {
  const { totalValue, dayChange, dayChangePercent, totalGainLoss, totalGainLossPercent } = usePortfolioSummary(portfolio.id)
  
  const isPositiveChange = dayChange >= 0
  const isPositiveGain = totalGainLoss >= 0

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{portfolio.name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {portfolio.id === 1 ? 'Growth' : portfolio.id === 2 ? 'Value' : portfolio.id === 3 ? 'International' : 'Crypto'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{portfolio.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <span className="font-semibold text-lg">${totalValue.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Today's Change</span>
            <div className={`flex items-center gap-1 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveChange ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span className="text-sm font-medium">
                ${Math.abs(dayChange).toLocaleString()} ({dayChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Gain/Loss</span>
            <div className={`flex items-center gap-1 ${isPositiveGain ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveGain ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span className="text-sm font-medium">
                ${Math.abs(totalGainLoss).toLocaleString()} ({totalGainLossPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Link to={`/portfolio/${portfolio.id}`}>
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Portfolio
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

const PortfolioOverview = () => {
  const { data: portfolios = [] } = usePortfolios()
  const { totalValue: grandTotal, dayChange: totalDayChange, dayChangePercent: totalDayChangePercent, totalGainLoss, totalGainLossPercent } = usePortfolioSummary()

  const isPositiveTotalChange = totalDayChange >= 0
  const isPositiveTotalGain = totalGainLoss >= 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Portfolio Overview</h1>
          <p className="text-muted-foreground">Manage and track your investment portfolios</p>
        </div>

        {/* Total Portfolio Summary */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">${grandTotal.toLocaleString()}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-1">
                <div className="text-sm text-muted-foreground">Today's Change</div>
                <div className={`flex items-center justify-center gap-1 ${isPositiveTotalChange ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveTotalChange ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-semibold">
                    ${Math.abs(totalDayChange).toLocaleString()} ({totalDayChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <div className="text-sm text-muted-foreground">Total Gain/Loss</div>
                <div className={`flex items-center justify-center gap-1 ${isPositiveTotalGain ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveTotalGain ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-semibold">
                    ${Math.abs(totalGainLoss).toLocaleString()} ({totalGainLossPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Portfolios */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Portfolios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolios.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PortfolioOverview