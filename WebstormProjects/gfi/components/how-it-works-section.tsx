import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, Database, Bot, Wrench, Smartphone, Cloud } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Database,
      title: "Data Ingestion",
      description: "Secure OAuth connection to banks, brokers, and finance apps. Normalized JSON stored in BigQuery.",
      color: "text-blue-600",
    },
    {
      icon: Bot,
      title: "Digital-Twin Builder",
      description: "Creates a comprehensive graph of assets, debts, cash-flow, and credit score.",
      color: "text-emerald-600",
    },
    {
      icon: Cloud,
      title: "Agent Core (Gemini)",
      description: "Heavy reasoning with Gemini 1.5 Pro, quick Q&A with Gemini 1.5 Flash.",
      color: "text-purple-600",
    },
    {
      icon: Wrench,
      title: "Tool Plugins",
      description: "Monte-Carlo simulator, IRR/CAGR calculators, and optimization tools.",
      color: "text-orange-600",
    },
    {
      icon: Smartphone,
      title: "Front End (Flutter)",
      description: "Chat interface, interactive charts, and voice capabilities.",
      color: "text-teal-600",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How FiNexus AI works</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A bird's-eye view of our comprehensive financial AI architecture
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <Card className="w-full max-w-2xl border-2 hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-muted`}>
                        <step.icon className={`h-8 w-8 ${step.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && <ArrowDown className="h-6 w-6 text-muted-foreground my-4" />}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
            <p className="text-center text-foreground">
              <strong>Powered by Google Cloud:</strong> All components run on Google Cloud services such as Vertex AI
              Agent Builder, BigQuery and Firebase Hosting.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
