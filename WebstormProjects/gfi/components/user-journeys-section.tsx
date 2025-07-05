import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, CreditCard, AlertCircle, ArrowRight } from "lucide-react"

export function UserJourneysSection() {
  const journeys = [
    {
      icon: TrendingUp,
      title: "Investment Projection",
      steps: [
        'User: "If I increase my SIP by ₹5k/month, what\'s my net-worth at 40?"',
        "Gemini runs the Scenario Simulator, assumes user's salary growth and inflation, and displays a line chart plus a Monte-Carlo probability band.",
        'One-tap button: "Raise SIP by ₹5k" executes the change via the broker\'s API.',
      ],
      color: "text-emerald-600",
    },
    {
      icon: CreditCard,
      title: "Debt Payoff Coach",
      steps: [
        "FiNexus spots three loans and recommends an avalanche schedule that cuts total interest by ₹1.2L.",
        "User accepts; calendar reminders and auto-debit dates are set.",
      ],
      color: "text-blue-600",
    },
    {
      icon: AlertCircle,
      title: "Performance Alert",
      steps: [
        "System flags an equity fund underperforming Nifty 50 by 4% for three months.",
        "Suggests switching to a better-ranked fund; shows expected corpus boost.",
      ],
      color: "text-orange-600",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Example user journeys</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            See how FiNexus AI transforms complex financial decisions into simple conversations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {journeys.map((journey, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <journey.icon className={`h-8 w-8 ${journey.color}`} />
                  <CardTitle className="text-xl text-foreground">
                    Journey {index + 1} – {journey.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journey.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-sm font-semibold">
                        {stepIndex + 1}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6 bg-transparent">
                  Try this journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
