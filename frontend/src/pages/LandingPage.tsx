import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Zap, Lightbulb, GitCompare, Mouse, CheckCircle, ChevronRight, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';

const HeroSection = () => (
  <div className="relative overflow-hidden bg-editor-sidebar py-20 md:py-32">
    <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern [mask-image:radial-gradient(black,transparent_70%)]" />
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-code-blue via-code-purple to-code-green bg-clip-text text-transparent animate-fadeIn">
          Understand, Optimize & Master Your Code
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 animate-slideUp">
          Your AI-powered assistant that analyzes code snippets, explains them in plain language, 
          and suggests optimized fixes to help you become a better programmer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-slideUp" style={{ animationDelay: '200ms' }}>
          <Link to="/app">
            <Button size="lg" className="gap-2">
              Try It Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <Card className="border border-white/10 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
    <CardContent className="pt-6">
      <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const FeaturesSection = () => (
  <div className="py-20 bg-editor">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Designed to help you understand, debug, and improve your code with ease.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={Code} 
          title="Multi-Language Support" 
          description="Analyze code written in JavaScript, TypeScript, Python, Java, and more."
        />
        <FeatureCard 
          icon={Lightbulb} 
          title="Plain Language Explanations" 
          description="Get clear, concise explanations of what your code does and how it works."
        />
        <FeatureCard 
          icon={Zap} 
          title="Performance Optimization" 
          description="Identify bottlenecks and receive suggestions for improving efficiency."
        />
        <FeatureCard 
          icon={GitCompare} 
          title="Side-by-Side Comparison" 
          description="Compare your original code with the optimized version to see improvements."
        />
        <FeatureCard 
          icon={CheckCircle} 
          title="Best Practices" 
          description="Learn coding standards and best practices for writing cleaner, better code."
        />
        <FeatureCard 
          icon={Mouse} 
          title="Interactive Learning" 
          description="Interact with your code analysis in real-time to deepen understanding."
        />
      </div>
    </div>
  </div>
);

const DemoSection = () => (
  <div className="py-20 bg-editor-lighter">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Watch how CodeClarity transforms the way you understand and improve your code.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-glass-strong border border-white/10">
        <div className="aspect-w-16 aspect-h-9 bg-editor-sidebar relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Interactive Demo</p>
              <Link to="/app">
                <Button>Launch App to See Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialSection = () => (
  <div className="py-20 bg-editor">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Developers from around the world are using CodeClarity to level up their coding skills.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          {
            quote: "CodeClarity helped me understand complex algorithms in minutes instead of hours.",
            author: "Sarah J.",
            role: "Frontend Developer"
          },
          {
            quote: "The performance optimization suggestions improved my app's speed by 40%. Incredible tool!",
            author: "Michael T.",
            role: "Software Engineer"
          },
          {
            quote: "As a CS student, this tool has been invaluable for learning and improving my coding skills.",
            author: "Alex P.",
            role: "Computer Science Student"
          }
        ].map((testimonial, index) => (
          <Card key={index} className="border border-white/10 bg-card/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const CTASection = () => (
  <div className="py-20 bg-editor-sidebar relative overflow-hidden">
    <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern [mask-image:radial-gradient(black,transparent_70%)]" />
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Master Your Code?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Start analyzing and improving your code today. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="gap-2">
              Get Started For Free <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/app">
            <Button variant="outline" size="lg">
              Try Without Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const FooterSection = () => (
  <footer className="py-12 bg-editor-sidebar/80 border-t border-white/10">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-6 md:mb-0">
          <Terminal className="h-5 w-5 text-code-blue mr-2" />
          <span className="font-semibold text-lg">CodeClarity</span>
        </div>
        
        <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center md:justify-end">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </a>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CodeClarity. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-editor flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default LandingPage;
