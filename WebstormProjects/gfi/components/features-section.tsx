import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network, BarChart, PieChart, CreditCard, AlertTriangle, Mic } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Network,
      title: "Digital-Twin Builder",
      description: "Merges assets, liabilities, cash-flow, credit score into one semantic graph",
      tech: "Vertex AI Functions",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
    },
    {
      icon: BarChart,
      title: "Scenario Simulator",
      description: "Projects future wealth under inflation, salary growth, market returns",
      tech: "Gemini Pro + BigQuery ML",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
    },
    {
      icon: PieChart,
      title: "Portfolio Optimiser",
      description: "Suggests rebalancing, SIP tweaks, benchmark comparisons",
      tech: "Gemini + live market API",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400",
    },
    {
      icon: CreditCard,
      title: "Debt & Credit Coach",
      description: "Creates snowball / avalanche payoff plan, forecasts credit-score impact",
      tech: "Gemini + credit-bureau feed",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400",
    },
    {
      icon: AlertTriangle,
      title: "Anomaly Sentinel",
      description: "Real-time detection of unusual income or spend patterns",
      tech: "Vertex AI Anomaly Detection",
      color: "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400",
    },
    {
      icon: Mic,
      title: "Voice-First UX",
      description: 'Ask "Hey Fi, can I afford a ₹50 L home loan?"',
      tech: "Cloud Speech-to-Text & TTS",
      color: "bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400",
    },
  ]

  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Feature modules you can turn on or off
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Customize your FiNexus AI experience with modular features powered by Google AI
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {feature.tech}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
