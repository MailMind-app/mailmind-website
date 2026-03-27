"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, Presentation, Mail } from "lucide-react"
import { useState } from "react"

const demoIncludes = [
  "Live walkthrough of the MailMind dashboard",
  "Explanation of AI decisions and fallback logic",
  "Training mode and control options",
  "Real-world business email examples",
]

const benefits = [
  { icon: CheckCircle, text: "No obligation" },
  { icon: Clock, text: "No sales pressure" },
  { icon: Presentation, text: "Real software demo, not slides" },
]

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
              Request a <span className="text-primary">MailMind</span> demo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how MailMind safely automates business email — with full control and transparency.
            </p>
          </div>
        </section>

        {/* Demo Content */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">What the demo includes:</h2>
                  <ul className="space-y-4">
                    {demoIncludes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit.text} className="flex items-center gap-3">
                      <benefit.icon className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                
              </div>

              {/* Right Column - Form */}
              <div className="bg-card border border-border rounded-xl p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Bedankt voor uw aanvraag!
                    </h3>
                    <p className="text-muted-foreground">
                      We nemen binnen 1 werkdag contact met u op.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-white">
                        Company name
                      </label>
                      <Input
                        id="company"
                        required
                        placeholder="Uw bedrijfsnaam"
                        className="bg-input border-border text-white placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-white">
                        Business email address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="naam@bedrijf.nl"
                        className="bg-input border-border text-white placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="volume" className="text-sm font-medium text-white">
                        Estimated emails per month
                      </label>
                      <Select>
                        <SelectTrigger className="bg-input border-border text-white">
                          <SelectValue placeholder="Optional" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="under-500">Minder dan 500</SelectItem>
                          <SelectItem value="500-1000">500 - 1.000</SelectItem>
                          <SelectItem value="1000-5000">1.000 - 5.000</SelectItem>
                          <SelectItem value="5000-10000">5.000 - 10.000</SelectItem>
                          <SelectItem value="over-10000">Meer dan 10.000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-white">
                        Optional message
                      </label>
                      <Textarea
                        id="message"
                        rows={4}
                        placeholder="Vertel ons over uw specifieke behoeften..."
                        className="bg-input border-border text-white placeholder:text-muted-foreground resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                      {isSubmitting ? "Verzenden..." : "Request demo"}
                    </Button>

                    <div className="text-center space-y-2 pt-4">
                      <p className="text-sm text-muted-foreground">
                        No spam. No sales tricks. Just a clear demo.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        We usually respond within 1 business day.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
