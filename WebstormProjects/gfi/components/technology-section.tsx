import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Cog, Database, Smartphone } from "lucide-react"

export function TechnologySection() {
  const technologies = [
    {
      icon: Brain,
      title: "Gemini 1.5 Pro / Flash",
      description: "Heavy vs. quick reasoning tasks",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Cog,
      title: "Vertex AI Agent Builder",
      description: "Orchestrates multi-step tool calls",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Database,
      title: "BigQuery ML",
      description: "Large-scale simulations directly on structured finance data",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Smartphone,
      title: "Flutter Web/Mobile",
      description: "Single codebase for chat, charts and voice, deployed on Firebase Hosting",
      color: "text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <section id="technology" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Technology highlights</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Built on cutting-edge Google Cloud AI and infrastructure services
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {technologies.map((tech, index) => (
            <Card key={index} className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-muted`}>
                    <tech.icon className={`h-8 w-8 ${tech.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{tech.title}</h3>
                    <p className="text-muted-foreground mb-4">{tech.description}</p>
                    <Badge variant="outline" className="text-xs">
                      Google Cloud
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
