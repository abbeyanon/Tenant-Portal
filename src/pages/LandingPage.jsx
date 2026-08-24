"use client";

import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const features = [
    {
      icon: "🏠",
      title: "Easy Management",
      description: "Manage your rental properties with an intuitive dashboard",
    },
    {
      icon: "👥",
      title: "Tenant Portal",
      description: "Give tenants a dedicated portal for maintenance requests and payments",
    },
    {
      icon: "💰",
      title: "Payment Tracking",
      description: "Track rent payments and send automated reminders",
    },
    {
      icon: "🔧",
      title: "Maintenance",
      description: "Handle maintenance requests efficiently and log repairs",
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "Get insights with detailed reports and analytics",
    },
    {
      icon: "🔒",
      title: "Secure & Safe",
      description: "Bank-level security to protect your data and transactions",
    },
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Automate routine tasks and focus on growing your business",
      details: [
        "Automated rent reminders",
        "Self-service maintenance requests",
        "Digital lease agreements",
      ],
    },
    {
      title: "Increase Revenue",
      description: "Reduce vacancies and improve tenant satisfaction",
      details: ["Quick tenant onboarding", "Transparent communication", "Professional management"],
    },
    {
      title: "Reduce Costs",
      description: "Eliminate paperwork and streamline operations",
      details: ["Less administrative work", "Reduced disputes", "Better record keeping"],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Property Manager",
      company: "Urban Properties Inc.",
      image: "👩‍💼",
      text: "This platform has completely transformed how I manage my 15 properties. The tenant portal has reduced my support tickets by 60%!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Real Estate Investor",
      company: "Chen Real Estate",
      image: "👨‍💼",
      text: "The payment tracking and analytics features give me exactly the insights I need to make better business decisions.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Building Owner",
      company: "Rodriguez Properties",
      image: "👩‍🔬",
      text: "Outstanding customer support and an incredibly user-friendly interface. Highly recommend to any property manager!",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thanks for signing up! Check ${email} for updates.`);
      setEmail("");
    }
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">🏘️ TenantHub</div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">
              Features
            </a>
            <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition">
              Benefits
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">
              Testimonials
            </a>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition">
              Login
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Tenant Portal Management
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Simplify property management with our all-in-one platform. Manage tenants, track payments,
            handle maintenance, and grow your business effortlessly.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
              Get Started Free
            </button>
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-lg">
              Watch Demo
            </button>
          </div>

          <div className="flex justify-center gap-8 text-gray-700 text-sm">
            <div>✓ No credit card required</div>
            <div>✓ 14-day free trial</div>
            <div>✓ 24/7 support</div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-12 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Everything you need to manage your rental properties efficiently
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 bg-white border border-gray-200 rounded-lg hover:shadow-xl transition-all hover:border-blue-200"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            See how property managers are transforming their business
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <h3 className="text-2xl font-bold text-blue-600 mb-3">{benefit.title}</h3>
                <p className="text-gray-700 mb-6">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Loved by Professionals</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            See what property managers think about TenantHub
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 border border-blue-200">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
            </div>

            <p className="text-xl text-gray-700 text-center mb-8 italic">
              "{testimonials[testimonialIndex].text}"
            </p>

            <div className="text-center mb-8">
              <p className="text-4xl mb-2">{testimonials[testimonialIndex].image}</p>
              <p className="font-semibold text-gray-900">{testimonials[testimonialIndex].name}</p>
              <p className="text-sm text-gray-600">
                {testimonials[testimonialIndex].role} at {testimonials[testimonialIndex].company}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={prevTestimonial}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                ← Previous
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === testimonialIndex ? "bg-blue-600 w-8" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Choose the plan that works for you
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "$29", features: ["Up to 5 properties", "Basic analytics", "Email support"] },
              {
                name: "Professional",
                price: "$79",
                features: ["Unlimited properties", "Advanced analytics", "Priority support"],
                highlight: true,
              },
              { name: "Enterprise", price: "Custom", features: ["Custom features", "Dedicated support", "API access"] },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-lg transition-all ${
                  plan.highlight
                    ? "bg-blue-600 text-white shadow-xl scale-105"
                    : "bg-white border border-gray-200"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    plan.highlight
                      ? "bg-white text-blue-600 hover:bg-gray-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of property managers already using TenantHub
          </p>

          <form onSubmit={handleNewsletterSignup} className="flex gap-2 mb-6 flex-col md:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              Start Free Trial
            </button>
          </form>

          <p className="text-sm text-blue-100">14-day free trial. No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-white font-bold text-lg mb-4">🏘️ TenantHub</p>
              <p className="text-sm">Modern property management platform for the 21st century.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2025 TenantHub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
