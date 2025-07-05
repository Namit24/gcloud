import { Card, CardContent } from "@/components/ui/card"
import { Shield, Download, Lock } from "lucide-react"

export function DataSafetySection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Data safety & control</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Your financial data security and privacy are our top priorities
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <Lock className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xl font-semibold text-foreground">Isolated Data Storage</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                All finance data lives in a user-scoped Google Cloud project, isolating it from other users and the
                vendor.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <Download className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xl font-semibold text-foreground">Data Portability</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                One-click "Export My Insights" delivers JSON/CSV/PDF to satisfy data-portability rules.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-card border-2">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-emerald-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">Complete Control</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                With these pieces, FiNexus AI turns passive account statements into an interactive, always-on strategy
                copilot, empowering users to make high-impact money decisions with confidence.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
