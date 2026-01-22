import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Yoga
          </h1>
          <p className="text-lg md:text-xl text-purple-200">
            Guided sessions with voice instructions
          </p>
        </header>

        {/* Main CTA Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Quick Start */}
          <Link href="/quick-start" className="group">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-12 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 text-white shadow-2xl">
              <div className="text-6xl mb-6">⚡</div>
              <h2 className="text-3xl font-bold mb-3">
                Quick Start
              </h2>
              <p className="text-purple-100 text-lg">
                Begin a guided session now
              </p>
            </div>
          </Link>

          {/* Custom Routine */}
          <Link href="/routines" className="group">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-12 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 text-white shadow-2xl">
              <div className="text-6xl mb-6">🧘</div>
              <h2 className="text-3xl font-bold mb-3">
                Custom Routine
              </h2>
              <p className="text-indigo-100 text-lg">
                Create your own practice
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
