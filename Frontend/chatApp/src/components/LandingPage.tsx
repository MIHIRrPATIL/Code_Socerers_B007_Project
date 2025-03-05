"use client"

import { useState, useEffect, useRef } from "react"
import {
  Globe,
  BarChart2,
  Clock,
  MessageCircle,
  Star,
  Check,
  ArrowRight,
  Play,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  Building,
  Award,
  Smile,
  RefreshCw,
  DollarSign,
} from "lucide-react"
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion"
import "./LandingPage.css" // Import the CSS file
import hero from "./image.png"           
const LandingPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [colorTheme, setColorTheme] = useState("purple")

  // Refs for sections
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  // InView hooks for animations
  const isHeroInView = useInView(heroRef, { once: false, amount: 0.3 })
  const isFeaturesSectionInView = useInView(featuresRef, { once: true, amount: 0.2 })
  const isPricingSectionInView = useInView(pricingRef, { once: true, amount: 0.2 })
  const isTestimonialsSectionInView = useInView(testimonialsRef, { once: true, amount: 0.2 })
  const isHowItWorksSectionInView = useInView(howItWorksRef, { once: true, amount: 0.2 })
  const isFAQSectionInView = useInView(faqRef, { once: true, amount: 0.2 })

  // Scroll animation for hero section
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(heroScrollProgress, [0, 1], [1, 0.3])
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 100])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / scrollTotal) * 100
      setScrollProgress(progress)

      // Check if page is scrolled for nav styling
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      closeMenu()
    }
  }

  const changeColorTheme = (theme: string) => {
    setColorTheme(theme)
    document.documentElement.dataset.theme = theme
  }

  const features = [
    {
      title: "AI Communication Hub",
      description: "Revolutionize client interactions with intelligent, context-aware communication.",
      icon: <Globe className="feature-icon" />,
      details: [
        "Multi-language real-time translation",
        "Sentiment and tone analysis",
        "Cultural context understanding",
      ],
    },
    {
      title: "Smart Analytics Engine",
      description: "Transform raw interactions into strategic insights.",
      icon: <BarChart2 className="feature-icon" />,
      details: ["Predictive communication patterns", "Client engagement scoring", "Performance visualization"],
    },
    {
      title: "Adaptive Engagement",
      description: "Personalized follow-up strategies powered by AI.",
      icon: <Clock className="feature-icon" />,
      details: ["Automated communication workflows", "Intelligent scheduling", "Priority client tracking"],
    },
    {
      title: "Enterprise Integration",
      description: "Seamlessly connect with your existing business tools.",
      icon: <Building className="feature-icon" />,
      details: ["CRM integration", "Email and calendar sync", "Custom API access"],
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      features: [
        "Up to 50 AI interactions",
        "Basic multilingual support",
        "Limited analytics dashboard",
        "Email support",
      ],
      recommended: false,
      cta: "Start Free",
      icon: <Zap size={24} />,
    },
    {
      name: "Professional",
      price: "$49",
      period: "per month",
      features: [
        "Unlimited AI interactions",
        "Advanced analytics",
        "Team collaboration tools",
        "Priority support",
        "Custom integrations",
      ],
      recommended: true,
      cta: "Start 14-Day Trial",
      icon: <Star size={24} />,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored plan",
      features: [
        "Dedicated AI solution",
        "Custom language models",
        "Advanced security",
        "24/7 premium support",
        "Dedicated account manager",
        "On-premise deployment option",
      ],
      recommended: false,
      cta: "Contact Sales",
      icon: <Building size={24} />,
    },
  ]

  const testimonials = [
    {
      name: "Elena Rodriguez",
      role: "Global Sales Director",
      company: "TechVista Inc.",
      quote:
        "RealComm AI transformed our international communication strategy overnight. We've seen a 40% increase in client engagement across our global markets.",
      icon: <Smile className="testimonial-icon" />,
    },
    {
      name: "Michael Chen",
      role: "Tech Innovation Lead",
      company: "Horizon Properties",
      quote:
        "The AI's ability to understand cultural nuances is simply remarkable. It's like having a local expert in every market we operate in.",
      icon: <RefreshCw className="testimonial-icon" />,
    },
    {
      name: "Sarah Johnson",
      role: "Customer Success Manager",
      company: "Global Realty",
      quote:
        "Our agents save an average of 15 hours per week with RealComm AI handling routine communications and follow-ups.",
      icon: <DollarSign className="testimonial-icon" />,
    },
  ]

  const faqs = [
    {
      question: "How does RealComm AI handle multilingual communication?",
      answer:
        "Our AI uses advanced NLP models to provide real-time translation and cultural context understanding across 40+ languages. The system continuously learns from interactions to improve accuracy and cultural relevance.",
    },
    {
      question: "Is my data secure with RealComm AI?",
      answer:
        "Yes, we use enterprise-grade encryption and follow strict data privacy protocols. All data is encrypted both in transit and at rest. We are GDPR compliant and offer data residency options for enterprise clients.",
    },
    {
      question: "Can I customize the AI for my business needs?",
      answer:
        "Our Enterprise plan offers custom language models and workflows. We can train the AI on your specific business terminology, communication style, and brand voice to ensure consistent representation.",
    },
    {
      question: "How long does it take to implement RealComm AI?",
      answer:
        "Most clients are up and running within 48 hours. Our standard integration takes 1-2 days, while custom enterprise implementations typically take 1-2 weeks depending on the complexity of your requirements.",
    },
    {
      question: "Do you offer training and support?",
      answer:
        "Yes, all plans include access to our knowledge base and community forum. Professional plans include email and chat support, while Enterprise clients receive dedicated account management and 24/7 phone support.",
    },
  ]

  const stats = [
    { value: "5,000+", label: "Businesses", icon: <Building className="stat-icon" /> },
    { value: "40+", label: "Languages", icon: <Globe className="stat-icon" /> },
    { value: "99.9%", label: "Uptime", icon: <Shield className="stat-icon" /> },
    { value: "24/7", label: "Support", icon: <MessageCircle className="stat-icon" /> },
  ]

  return (
    <div className="landing-page" data-theme={colorTheme}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="animated-shape shape-circle shape-1"></div>
        <div className="animated-shape shape-circle shape-2"></div>
        <div className="animated-shape shape-circle shape-3"></div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />

      {/* Navigation */}
      <nav className={`fixed-nav ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <div className="logo">
            <Sparkles className="logo-icon" />
            <span>RealComm AI</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <button onClick={() => scrollToSection("features")} className="nav-link">
              Features
            </button>
            <button onClick={() => scrollToSection("how-it-works")} className="nav-link">
              How It Works
            </button>
            <button
             onClick={() => window.location.href = "https://agent-model.streamlit.app/"}
             className="nav-link"
             >
             Agentic Help
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="nav-link">
              Testimonials
            </button>
            <button onClick={() => scrollToSection("faq")} className="nav-link">
              FAQ
            </button>
            <button className="cta-button">
              Get Started <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" ref={heroRef} className="hero-section">
  <div className="hero-gradient">
    <div className="gradient-orb gradient-orb-1"></div>
    <div className="gradient-orb gradient-orb-2"></div>
    <div className="gradient-orb gradient-orb-3"></div>
  </div>

  <motion.div style={{ opacity: heroOpacity, y: heroY }} className="hero-content">
    {/* Left Side: Text Content */}
    <div className="hero-text-content">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="hero-badge"
      >
        <Award size={16} />
        <span>Trusted by leading real estate companies worldwide</span>
      </motion.div>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 30 }}
        animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        AI-Powered Real Estate <span className="gradient-text">Communication</span>
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 0, y: 30 }}
        animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Transform global client interactions with intelligent, multilingual communication tools. Close more deals
        with personalized, culturally-aware client engagement.
      </motion.p>

      <motion.div
        className="hero-cta-group"
        initial={{ opacity: 0, y: 30 }}
        animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <button className="primary-cta">
          <Zap className="button-icon" /> Start Free Trial
        </button>
        <button className="secondary-cta">
          <Play className="button-icon" /> Watch Demo
        </button>
      </motion.div>

      <motion.div
        className="hero-stats"
        initial={{ opacity: 0, y: 30 }}
        animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            {stat.icon}
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Right Side: Image */}
    <motion.div
      className="hero-image-container"
      initial={{ opacity: 0, x: 30 }}
      animate={isHeroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <img
        src={hero} 
        alt="AI-Powered Real Estate Communication"
        className="hero-image"
      />
    </motion.div>
  </motion.div>
</header>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="features-section">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to transform your client communications</p>
        </div>

        <AnimatePresence>
          {isFeaturesSectionInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="features-grid"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="feature-card"
                >
                  <div className="feature-icon-wrapper">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <ul className="feature-list">
                    {feature.details.map((detail) => (
                      <li key={detail}>
                        <Check className="check-icon" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Simple integration, powerful results</p>
        </div>

        <AnimatePresence>
          {isHowItWorksSectionInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="how-it-works-content"
            >
              <div className="timeline">
                <motion.div
                  className="timeline-step"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <h3>Sign Up & Connect</h3>
                    <p>
                      Create an account and integrate with your existing tools. Our platform supports seamless
                      integration with popular CRMs and communication tools.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="timeline-connector"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />

                <motion.div
                  className="timeline-step"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <h3>AI Analyzes Interactions</h3>
                    <p>
                      Our AI processes and analyzes all client communications, providing insights into sentiment, tone,
                      and cultural context.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="timeline-connector"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                />

                <motion.div
                  className="timeline-step"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <h3>Get Insights & Take Action</h3>
                    <p>
                      Receive actionable insights and automate follow-ups. Our AI suggests personalized responses and
                      schedules follow-ups for you.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="how-it-works-pattern"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="pricing-section">
        <div className="section-header">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that's right for your business</p>
        </div>

        <AnimatePresence>
          {isPricingSectionInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="pricing-grid"
            >
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`pricing-card ${plan.recommended ? "recommended" : ""}`}
                >
                  {plan.recommended && <div className="recommended-badge">Most Popular</div>}
                  <div className="pricing-icon-wrapper">{plan.icon}</div>
                  <h3>{plan.name}</h3>
                  <div className="price-container">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  <ul className="pricing-features">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check className="check-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="plan-cta">
                    {plan.cta}
                    <ArrowRight className="arrow-icon" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Success stories from businesses like yours</p>
        </div>

        <AnimatePresence>
          {isTestimonialsSectionInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="testimonials-container"
            >
              <div className="testimonials-grid">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="testimonial-card"
                  >
                    <div className="testimonial-quote">
                      <blockquote>"{testimonial.quote}"</blockquote>
                    </div>
                    <div className="testimonial-author">
                      <div className="author-avatar-placeholder">{testimonial.icon}</div>
                      <div className="author-info">
                        <h4>{testimonial.name}</h4>
                        <p>{testimonial.role}</p>
                        <p className="company-name">{testimonial.company}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="testimonial-brands">
                <p>Trusted by leading companies worldwide</p>
                <div className="brand-logos">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className={`brand-box brand-box-${index + 1}`}>
                      <Star className="brand-icon" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FAQ Section */}
      <section id="faq" ref={faqRef} className="faq-section">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about RealComm AI</p>
        </div>

        <AnimatePresence>
          {isFAQSectionInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="faq-content"
            >
              <div className="faq-grid">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`faq-item ${openFAQIndex === index ? "open" : ""}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="faq-question">
                      <span>{faq.question}</span>
                      <button
                        className="faq-toggle"
                        aria-expanded={openFAQIndex === index}
                        aria-controls={`faq-answer-${index}`}
                      >
                        {openFAQIndex === index ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {openFAQIndex === index && (
                        <motion.div
                          id={`faq-answer-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="faq-answer"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              <div className="faq-cta">
                <h3>Still have questions?</h3>
                <p>Our team is here to help you get started with RealComm AI</p>
                <button className="primary-cta">Contact Support</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to transform your client communications?</h2>
          <p>Join thousands of businesses already using RealComm AI</p>
          <div className="cta-buttons">
            <button className="primary-cta">
              <Zap className="button-icon" /> Start Free Trial
            </button>
            <button className="secondary-cta">
              <MessageCircle className="button-icon" /> Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <Sparkles className="logo-icon" />
                <span>RealComm AI</span>
              </div>
              <p className="footer-tagline">Transforming real estate communication with AI-powered solutions.</p>
              <div className="social-links">
                <a href="#" aria-label="Twitter">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-links-container">
              <div className="footer-links-column">
                <h4>Product</h4>
                <ul>
                  <li>
                    <a href="#features">Features</a>
                  </li>
                  <li>
                    <a href="#pricing">Pricing</a>
                  </li>
                  <li>
                    <a href="#testimonials">Testimonials</a>
                  </li>
                  <li>
                    <a href="#faq">FAQ</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Company</h4>
                <ul>
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                  <li>
                    <a href="#">Blog</a>
                  </li>
                  <li>
                    <a href="#">Press</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Resources</h4>
                <ul>
                  <li>
                    <a href="#">Documentation</a>
                  </li>
                  <li>
                    <a href="#">Help Center</a>
                  </li>
                  <li>
                    <a href="#">API</a>
                  </li>
                  <li>
                    <a href="#">Community</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Legal</h4>
                <ul>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#">Cookie Policy</a>
                  </li>
                  <li>
                    <a href="#">GDPR</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} RealComm AI. All Rights Reserved.</p>
            <div className="footer-locale">
              <Globe size={16} />
              <select aria-label="Select language">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

