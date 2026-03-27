"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

export default function DemoRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Bedankt voor uw aanvraag!
        </h3>
        <p className="text-muted-foreground">
          We nemen binnen 1 werkdag contact met u op.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="company" className="text-sm font-medium text-white">
          Bedrijfsnaam
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
          Zakelijk e-mailadres
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
          Geschat aantal e-mails per maand
        </label>
        <Select>
          <SelectTrigger className="bg-input border-border text-white">
            <SelectValue placeholder="Optioneel" />
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
          Optioneel bericht
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
        {isSubmitting ? "Verzenden..." : "Demo aanvragen"}
      </Button>

      <div className="text-center space-y-2 pt-4">
        <p className="text-sm text-muted-foreground">
          Geen spam. Geen verkooptrucs. Gewoon een duidelijke demo.
        </p>
        <p className="text-sm text-muted-foreground">
          We reageren meestal binnen 1 werkdag.
        </p>
      </div>
    </form>
  )
}
