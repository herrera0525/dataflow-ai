import { motion } from 'framer-motion';
import {
  Zap, FileText, Brain, Shield, Users, BarChart3,
  Upload, Bot, Clock, CheckCircle, ArrowRight, Sparkles
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Document Processing',
    description: 'Extract data from PDFs, images, and scanned documents with 99% accuracy.',
  },
  {
    icon: Brain,
    title: 'AI-Powered OCR',
    description: 'Advanced optical character recognition powered by machine learning.',
  },
  {
    icon: Bot,
    title: 'Smart Automation',
    description: 'Automate repetitive tasks like form filling and data entry.',
  },
  {
    icon: Upload,
    title: 'Drag & Drop',
    description: 'Simply drag files to process them. No complex setup required.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and compliance with GDPR, SOC2, HIPAA.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Multi-user access with role-based permissions and audit trails.',
  },
];

const stats = [
  { label: 'Documents Processed', value: '50M+' },
  { label: 'Hours Saved', value: '2M+' },
  { label: 'Active Companies', value: '10K+' },
  { label: 'Accuracy Rate', value: '99.5%' },
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['100 documents/month', 'Basic OCR', 'Email support', '1 user'],
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    features: ['5,000 documents/month', 'Advanced AI processing', 'Priority support', '10 users', 'API access', 'Custom workflows'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    features: ['Unlimited documents', 'Dedicated support', 'SSO & SAML', 'Unlimited users', 'On-premise option', 'Custom integrations'],
    popular: false,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                DataFlow<span className="text-blue-400">AI</span>
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </a>
              <a
                href="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Automate Your
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Data Entry Forever
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Transform hours of manual data work into seconds. Our AI extracts, organizes,
              and processes documents with enterprise-grade accuracy and security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/register"
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-lg font-medium hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#demo"
                className="px-8 py-4 rounded-xl border border-gray-700 text-lg font-medium hover:bg-white/5 transition-all duration-300"
              >
                Watch Demo
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-4 bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to automate your data entry workflow and boost productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-8 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-gray-500 text-sm">DataFlow AI Dashboard</span>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">Documents Today</span>
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold">1,234</div>
                  <div className="flex items-center mt-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    +12% from yesterday
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">Time Saved</span>
                    <Clock className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-bold">48h</div>
                  <div className="flex items-center mt-2 text-gray-400 text-sm">
                    This week
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">Accuracy</span>
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-bold">99.5%</div>
                  <div className="flex items-center mt-2 text-gray-400 text-sm">
                    AI processing rate
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 px-4 bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-lg">Start free. Scale as you grow.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-2xl border ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/50'
                    : 'bg-gray-900/50 border-gray-800'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <CheckCircle className="w-4 h-4 mr-3 text-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="/register"
                  className={`block w-full py-3 rounded-xl text-center font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25'
                      : 'border border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/20"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of companies saving hours every week with AI-powered automation.
            </p>
            <a
              href="/register"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-lg font-medium hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">DataFlowAI</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © 2024 DataFlowAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}