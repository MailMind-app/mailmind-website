'use client';

import { useState } from 'react';
import { FiMail, FiUsers, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function DemoPage() {
  const [formData, setFormData] = useState({
    bedrijfsnaam: '',
    email: '',
    volume: '',
    bericht: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Er ging iets mis bij het versturen');
      }

      setIsSuccess(true);
      setFormData({
        bedrijfsnaam: '',
        email: '',
        volume: '',
        bericht: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bedankt!
          </h2>
          <p className="text-gray-600 mb-8">
            We nemen binnen 1 werkdag contact op.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nog een demo aanvragen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiMail className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MailMind</span>
          </div>
          <a
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Terug naar home
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Vraag een <span className="text-blue-600">gratis demo</span> aan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ontdek hoe MailMind uw e-mailworkflow automatiseert. Vul het formulier in en we plannen een persoonlijke demo.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Slimme e-mailverwerking</h3>
              <p className="text-gray-600 text-sm">AI leest, categoriseert en beantwoordt uw e-mails automatisch.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gebouwd voor MKB</h3>
              <p className="text-gray-600 text-sm">Speciaal ontworpen voor kleine en middelgrote bedrijven.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Meetbare resultaten</h3>
              <p className="text-gray-600 text-sm">Bespaar tijd en verhoog de klanttevredenheid direct.</p>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan uw demo</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="bedrijfsnaam" className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrijfsnaam
                  </label>
                  <input
                    type="text"
                    id="bedrijfsnaam"
                    name="bedrijfsnaam"
                    required
                    value={formData.bedrijfsnaam}
                    onChange={handleChange}
                    placeholder="Uw bedrijfsnaam"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Zakelijk e-mailadres
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="naam@bedrijf.nl"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                    Geschat aantal e-mails per maand
                  </label>
                  <select
                    id="volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Selecteer...</option>
                    <option value="under-500">Minder dan 500</option>
                    <option value="500-1000">500 - 1.000</option>
                    <option value="1000-5000">1.000 - 5.000</option>
                    <option value="5000-10000">5.000 - 10.000</option>
                    <option value="over-10000">Meer dan 10.000</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bericht" className="block text-sm font-medium text-gray-700 mb-1">
                    Optioneel bericht
                  </label>
                  <textarea
                    id="bericht"
                    name="bericht"
                    rows={4}
                    value={formData.bericht}
                    onChange={handleChange}
                    placeholder="Vertel ons over uw specifieke behoeften..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Verzenden...' : 'Demo aanvragen'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Geen spam. Geen verkooptrucs. Gewoon een duidelijke demo.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MailMind. Alle rechten voorbehouden.
        </div>
      </footer>
    </div>
  );
}
