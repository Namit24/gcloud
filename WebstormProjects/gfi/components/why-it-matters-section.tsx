import { Card, CardContent } from "@/components/ui/card"
import { Target, RefreshCw, Lock } from "lucide-react"

export function WhyItMattersSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why does it matter?</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <Target className="h-12 w-12 text-emerald-600 mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-4">High-stakes guidance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Instead of tracking coffee spends, FiNexus tackles big-ticket calls such as asset allocation, retirement
                readiness and debt strategy, decisions that can be worth lakhs of rupees over time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <RefreshCw className="h-12 w-12 text-emerald-600 mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-4">Always up to date</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every new salary credit, SIP or bill automatically updates the twin, so projections and alerts are never
                stale.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <Lock className="h-12 w-12 text-emerald-600 mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-4">Privacy by design</h3>
              <p className="text-muted-foreground leading-relaxed">
                All computations stay inside the user's own Google Cloud project; data can be exported as CSV/JSON/PDF
                in one click.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
