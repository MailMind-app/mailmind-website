import { Metadata } from 'next'
import { Shield, Eye, Lock, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Beveiliging & AI-transparantie | MailMind',
  description: 'Ontdek hoe MailMind beveiliging, privacy en transparante AI combineert voor veilige email-automatisering.',
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Beveiliging en AI-transparantie by design
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Volledige controle over<br />jouw email en data
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            MailMind combineert geavanceerde AI met menselijke controle, transparantie en enterprise-grade beveiliging.
          </p>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Human-in-the-loop */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Menselijke controle als standaard
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>AI genereert concepten, jij beoordeelt voordat verzonden wordt</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Elke suggestie is aanpasbaar</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Geen automatische verzending zonder jouw akkoord</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Feedback verbetert de AI specifiek voor jouw bedrijf</span>
              </li>
            </ul>
          </div>

          {/* Transparent AI */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Transparante AI-beslissingen
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Inzicht in waarom de AI een beslissing neemt</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Zichtbaar of een email door AI of mens is afgehandeld</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Volledige beslissingslogging en traceerbaarheid</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Training-feedbackloop voor continue verbetering</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Geen black-box gedrag</span>
              </li>
            </ul>
          </div>

          {/* Security & Data Protection */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Beveiliging & databescherming
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Enterprise-grade toegangscontrole</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Veilige authenticatie</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Geen ongeautoriseerd datagebruik</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Zakelijke emaildata wordt veilig verwerkt</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Strikte scheiding tussen bedrijven (multi-tenant veiligheid)</span>
              </li>
            </ul>
          </div>

          {/* What MailMind does NOT do */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Wat MailMind NIET doet
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span>Verstuurt geen emails zonder toestemming</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span>Gokt niet wanneer informatie ontbreekt</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span>Vervangt geen menselijke verantwoordelijkheid</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span>Werkt niet zonder logging of toezicht</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom Statement */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600">
            MailMind is gebouwd voor organisaties die controle, transparantie en verantwoordelijkheid eisen — geen blinde automatisering.
          </p>
        </div>
      </section>
    </div>
  )
}
