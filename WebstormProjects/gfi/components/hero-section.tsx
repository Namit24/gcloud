import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, TrendingUp, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm leading-6 text-muted-foreground ring-1 ring-border/60 hover:ring-border backdrop-blur-sm warm-card transition-all duration-300">
              Your Personal Financial AI Assistant{" "}
              <a href="#what-is" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <ArrowRight className="inline h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground">
            <span className="text-emerald-600">FiNexus AI</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl leading-7 sm:leading-8 text-muted-foreground max-w-3xl mx-auto px-4">
            A personal "digital-twin" of your money that you can chat with, stress-test and auto-optimise in real time
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-base sm:text-lg px-6 sm:px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Your Financial Journey
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 warm-card hover:scale-105 transition-all duration-300 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
            <div className="warm-card flex flex-col items-center p-6 sm:p-8 rounded-2xl transition-all duration-300">
              <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 mb-4 sm:mb-6 shadow-sm">
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">AI-Powered Insights</h3>
              <p className="text-sm sm:text-base text-muted-foreground text-center leading-relaxed">
                Chat with your financial data using natural language
              </p>
            </div>
            <div className="warm-card flex flex-col items-center p-6 sm:p-8 rounded-2xl transition-all duration-300">
              <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 mb-4 sm:mb-6 shadow-sm">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                Real-time Optimization
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground text-center leading-relaxed">
                Automatically optimize your portfolio and debt strategy
              </p>
            </div>
            <div className="warm-card flex flex-col items-center p-6 sm:p-8 rounded-2xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 mb-4 sm:mb-6 shadow-sm">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Privacy by Design</h3>
              <p className="text-sm sm:text-base text-muted-foreground text-center leading-relaxed">
                Your data stays in your own Google Cloud project
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
