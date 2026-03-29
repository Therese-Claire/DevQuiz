import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeatureGrid from '../components/home/FeatureGrid';
import CategoryShowcase from '../components/home/CategoryShowcase';
import QuizPreview from '../components/home/QuizPreview';
import SocialProof from '../components/home/SocialProof';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const Home = () => {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const targets = document.querySelectorAll('.reveal-on-scroll');
        targets.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-background-dark selection:bg-primary selection:text-white overflow-x-hidden">
            <HeroSection />
            
            <div className="reveal-on-scroll">
                <FeatureGrid />
            </div>

            <div className="reveal-on-scroll">
                <CategoryShowcase />
            </div>

            <QuizPreview />

            <div className="reveal-on-scroll">
                <SocialProof />
            </div>

            {/* Final CTA / FAQ Shortcut */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center reveal-on-scroll">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                        Stop Guessing. <br />
                        <span className="text-secondary">Start Benchmarking.</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
                        DevQuiz is more than a quiz. It's a technical roadmap to your next level. 
                        Join thousands of engineers today.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link 
                            to="/register" 
                            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-2xl glow-primary"
                        >
                            Create Free Account
                        </Link>
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-mono border-b border-white/10 pb-1 cursor-help">
                            <HelpCircle size={16} />
                            <span>Read Technical FAQ</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 px-6 border-t border-white/5 text-center text-gray-500 text-xs font-mono tracking-widest uppercase">
                &copy; 2026 DevQuiz • Built for Engineers by Engineers
            </footer>
        </div>
    );
};

export default Home;
