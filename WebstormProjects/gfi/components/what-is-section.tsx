import { MessageCircle, BarChart3, CreditCard } from "lucide-react"

export function WhatIsSection() {
  return (
    <section id="what-is" className="py-12 sm:py-16 lg:py-20 section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            What is FiNexus AI?
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground px-4">
            FiNexus AI converts every rupee that flows through your bank, credit-card and investment accounts into a
            living financial twin—a structured model of your assets, debts, income and credit profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4">
          <div className="warm-card p-6 sm:p-8 rounded-2xl transition-all duration-300">
            <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 w-fit mb-4 sm:mb-6 shadow-sm">
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Natural Language Queries</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Ask questions like "Project my net-worth at 40 if I raise my SIP by ₹5k" and get instant, actionable
              answers.
            </p>
          </div>

          <div className="warm-card p-6 sm:p-8 rounded-2xl transition-all duration-300">
            <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 w-fit mb-4 sm:mb-6 shadow-sm">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Probability Analysis</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Get probability-based projections: "What's the probability I'll reach a ₹1 cr corpus by 2032?"
            </p>
          </div>

          <div className="warm-card p-6 sm:p-8 rounded-2xl transition-all duration-300 md:col-span-2 lg:col-span-1">
            <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 w-fit mb-4 sm:mb-6 shadow-sm">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Credit Optimization</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Discover "Which loan should I pre-pay first to lift my credit score fastest?" with data-driven insights.
            </p>
          </div>
        </div>

        <div className="warm-card p-6 sm:p-8 rounded-2xl transition-all duration-300 mx-4">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Interactive Experience</h3>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            The system answers with clear language, charts and one-click actions (e.g., "increase SIP", "set payoff
            reminder"), and can even speak the answer aloud for hands-free use.
          </p>
        </div>
      </div>
    </section>
  )
}
