import Link from 'next/link';

const features = [
  { icon: '👨‍⚕️', title: 'Find Doctors', desc: 'Browse specialists by expertise and availability' },
  { icon: '📅', title: 'Book Instantly', desc: 'Choose your slot and confirm in seconds' },
  { icon: '📧', title: 'Email Reminders', desc: 'Get confirmation and updates automatically' },
  { icon: '📋', title: 'Full History', desc: 'All your appointments in one place' },
];

const stats = [
  { value: '50+', label: 'Doctors' },
  { value: '1000+', label: 'Patients' },
  { value: '10+', label: 'Specializations' },
  { value: '24/7', label: 'Support' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b
        border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span className="text-xl font-bold text-blue-700">ClinicMS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700
              hover:text-blue-600 rounded-lg transition-colors">
            Login
          </Link>
          <Link href="/register"
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white
              rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50
        py-24 px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm
            font-medium px-4 py-1.5 rounded-full mb-6">
            Smart Clinic Management
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Healthcare made <span className="text-blue-600">simple</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Book doctor appointments, manage your health records, and stay on
            top of your care — all in one platform.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register"
              className="px-8 py-3.5 bg-blue-600 text-white font-semibold
                rounded-xl hover:bg-blue-700 transition-colors
                shadow-lg shadow-blue-200">
              Book an Appointment
            </Link>
            <Link href="/login"
              className="px-8 py-3.5 bg-white text-gray-700 font-semibold
                rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Everything you need
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Built for patients, doctors, and administrators
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title}
                className="bg-white border border-gray-100 rounded-2xl p-6
                  hover:shadow-md hover:border-blue-100 transition-all duration-200">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 bg-blue-600 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-blue-200 mb-8">
            Join thousands of patients who manage their health with ClinicMS
          </p>
          <Link href="/register"
            className="inline-block px-8 py-3.5 bg-white text-blue-700
              font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            Create your account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm">
          © 2025 Clinic Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}