// components/WelcomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PulsePointLogo from './PulsePointLogo';
import {
    User,
    UserCheck,
    Calendar,
    Heart,
    FileText,
    TrendingUp,
    Stethoscope,
    Clock,
    CreditCard,
    Star,
    BookOpen,
    Shield,
    Activity,
    Users,
    ChevronRight,
    Play,
    ArrowRight,
    Code,
    GraduationCap,
    Award
} from 'lucide-react';
import './WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();
    const [currentFeature, setCurrentFeature] = useState(0);
    const [isVisible, setIsVisible] = useState({});

    const patientFeatures = [
        {
            icon: <User className="w-8 h-8" />,
            title: "Profile Management",
            description: "Create and edit your personal profile with complete medical history"
        },
        {
            icon: <Activity className="w-8 h-8" />,
            title: "Health Logs Tracking",
            description: "Monitor weight, blood pressure, heart rate, blood sugar, and sleep patterns"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Health Analytics",
            description: "Visual graphs showing your health trends and improvements over time"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Medical Documents",
            description: "Secure backup of prescriptions, reports, and medical documents"
        },
        {
            icon: <Stethoscope className="w-8 h-8" />,
            title: "Find Doctors",
            description: "Browse departments and doctors with advanced search capabilities"
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Appointment Booking",
            description: "Schedule appointments with preferred doctors and time slots"
        },
        {
            icon: <CreditCard className="w-8 h-8" />,
            title: "Payment System",
            description: "Secure online payments and transaction management"
        },
        {
            icon: <Star className="w-8 h-8" />,
            title: "Doctor Reviews",
            description: "Rate and review doctors based on your experience"
        },
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Health Articles",
            description: "Access expert-written health articles and medical insights"
        }
    ];

    const doctorFeatures = [
        {
            icon: <UserCheck className="w-8 h-8" />,
            title: "Professional Profile",
            description: "Manage your medical credentials and specialization details"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Schedule Management",
            description: "Set recurring or specific date schedules with flexible time slots"
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Appointment Management",
            description: "View, manage, and organize patient appointments efficiently"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Prescription System",
            description: "Create digital prescriptions with drug selection and investigations"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Patient Management",
            description: "Access patient history, health logs, and medical documents"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Revenue Analytics",
            description: "Track earnings by day, week, month, and year with detailed insights"
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Patient Statistics",
            description: "Monitor patient appointments, cancellations, and completion rates"
        },
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Health Content Creation",
            description: "Write and publish educational health articles for patients"
        }
    ];

    // Feature rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature(prev => (prev + 1) % Math.max(patientFeatures.length, doctorFeatures.length));
        }, 3000);

        return () => clearInterval(interval);
    }, [patientFeatures.length, doctorFeatures.length]);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(prev => ({
                        ...prev,
                        [entry.target.id]: entry.isIntersecting
                    }));
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Tab switching functionality
    useEffect(() => {
        const tabButtons = document.querySelectorAll('.tab-button');
        const featureLists = document.querySelectorAll('.features-list');

        const handleTabClick = (e) => {
            const button = e.currentTarget;
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and lists
            tabButtons.forEach(btn => btn.classList.remove('active'));
            featureLists.forEach(list => list.classList.remove('active'));

            // Add active class to clicked button and corresponding list
            button.classList.add('active');
            const targetList = document.querySelector(`.${targetTab}-features`);
            if (targetList) {
                targetList.classList.add('active');
            }
        };

        tabButtons.forEach(button => {
            button.addEventListener('click', handleTabClick);
        });

        // Cleanup function
        return () => {
            tabButtons.forEach(button => {
                button.removeEventListener('click', handleTabClick);
            });
        };
    }, []);

    const handleGetStarted = () => {
        navigate('/auth');
    };

    return (
        <div className="welcome-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="floating-shapes">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className={`floating-shape shape-${i % 3 + 1}`}></div>
                        ))}
                    </div>
                </div>

                {/* <div className="transform scale-[0.8] origin-top"> */}
                    <div className="hero-container">
                        <div className="hero-content">
                            <div className="hero-logo">
                                <PulsePointLogo className="w-30 h-30" />
                            </div>

                            <div className="hero-text">
                                <h1 className="hero-title">
                                    PulsePoint : <span className="gradient-text">Doctor-Patient Appointment</span><br />
                                    Management System
                                </h1>
                                <p className="hero-subtitle">
                                    & Healthcare Portal
                                </p>
                                <div className="hero-description">
                                    <p>Revolutionizing healthcare management with cutting-edge technology</p>
                                    <div className="hero-features">
                                        <span>✨ Connect patients with doctors seamlessly</span>
                                        <span>📊 Track health efficiently</span>
                                        <span>📅 Manage appointments intelligently</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hero-actions">
                                <button className="cta-button primary" onClick={handleGetStarted}>
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="cta-button secondary">
                                    <Play className="w-5 h-5" />
                                    <span>Watch Demo</span>
                                </button>
                            </div>
                        </div>

                        <div className="hero-visual">
                            <div className="dashboard-mockup">
                                <div className="mockup-header">
                                    <div className="mockup-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <span className="mockup-title">PulsePoint Dashboard</span>
                                </div>
                                <div className="mockup-content">
                                    <div className="mockup-sidebar">
                                        <div className="sidebar-item active">
                                            <div className="sidebar-icon"></div>
                                            <span>Dashboard</span>
                                        </div>
                                        <div className="sidebar-item">
                                            <div className="sidebar-icon"></div>
                                            <span>Appointments</span>
                                        </div>
                                        <div className="sidebar-item">
                                            <div className="sidebar-icon"></div>
                                            <span>Health Logs</span>
                                        </div>
                                    </div>
                                    <div className="mockup-main">
                                        <div className="chart-area">
                                            <div className="chart-bars">
                                                {[...Array(7)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="chart-bar"
                                                        style={{ height: `${30 + Math.random() * 50}%` }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

            </section>

            {/* Features Section */}
            <section className="features-section" id="features" data-animate>
                <div className="container">
                    <div className="section-header">
                        <h2 className={`section-title ${isVisible.features ? 'animate-in' : ''}`}>
                            Comprehensive Healthcare Solutions
                        </h2>
                        <p className="section-subtitle">
                            Empowering both patients and doctors with advanced digital tools
                        </p>
                    </div>

                    <div className="features-tabs">
                        <div className="tab-buttons">
                            <button className="tab-button active" data-tab="patient">
                                <div className="tab-icon">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="tab-content">
                                    <span className="tab-title">Patient Features</span>
                                    <span className="tab-subtitle">Healthcare at your fingertips</span>
                                </div>
                            </button>
                            <button className="tab-button" data-tab="doctor">
                                <div className="tab-icon">
                                    <Stethoscope className="w-6 h-6" />
                                </div>
                                <div className="tab-content">
                                    <span className="tab-title">Doctor Features</span>
                                    <span className="tab-subtitle">Professional practice management</span>
                                </div>
                            </button>
                        </div>

                        <div className="features-grid">
                            <div className="features-list patient-features active">
                                {patientFeatures.map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`feature-card ${currentFeature === index ? 'highlighted' : ''}`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="feature-icon">{feature.icon}</div>
                                        <div className="feature-content">
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                        <div className="feature-arrow">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="features-list doctor-features">
                                {doctorFeatures.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="feature-card"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="feature-icon">{feature.icon}</div>
                                        <div className="feature-content">
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                        <div className="feature-arrow">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section" id="stats" data-animate>
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Users className="w-8 h-8" />
                            </div>
                            <div className="stat-content">
                                <h3>10,000+</h3>
                                <p>Active Users</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <div className="stat-content">
                                <h3>50,000+</h3>
                                <p>Appointments Booked</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div className="stat-content">
                                <h3>99.9%</h3>
                                <p>Data Security</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <Heart className="w-8 h-8" />
                            </div>
                            <div className="stat-content">
                                <h3>4.9/5</h3>
                                <p>User Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Transform Your Healthcare Experience?</h2>
                        <p>Join thousands of patients and doctors already using PulsePoint</p>
                        <button className="cta-button large" onClick={handleGetStarted}>
                            <span>Start Your Journey</span>
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Developer Credits Section */}
            <section className="credits-section">
                <div className="credits-container">
                    <h2 className="credits-title">
                        <Code className="w-8 h-8 inline-block mr-3" />
                        Meet the Noob Developers
                    </h2>
                    <p className="credits-subtitle">
                        Crafted with (void -_- :p)
                    </p>

                    <div className="developers-grid">
                        <div className="developer-card">
                            <h3 className="developer-name">Md. Riyadun Nabi (Riyad)</h3>
                            <div className="developer-details">
                                <div className="detail-item">
                                    {/* <span className="detail-label">Roll No:</span> */}
                                    {/* <span>2205076</span> */}
                                </div>
                                <div className="detail-item">
                                    <GraduationCap className="w-4 h-4" />
                                    <span>BUET CSE - 2022</span>
                                </div>
                            </div>
                        </div>

                        <div className="developer-card">
                            <h3 className="developer-name">Fardin Fuad</h3>
                            <div className="developer-details">
                                <div className="detail-item">
                                    {/* <span className="detail-label">Roll No:</span> */}
                                    {/* <span>2205084</span> */}
                                </div>
                                <div className="detail-item">
                                    <GraduationCap className="w-4 h-4" />
                                    <span>BUET CSE - 2022</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="university-info">
                        <h3 className="university-name">
                            <Award className="w-6 h-6 inline-block mr-2" />
                            Bangladesh University of Engineering and Technology
                        </h3>
                        <p className="university-details">
                            Department of Computer Science and Engineering
                        </p>
                    </div>

                    <div className="course-info">
                        <h3 className="course-title">Academic Project - CSE 216 (DBMS Course)</h3>
                        <p className="course-description">
                            This comprehensive healthcare management system was developed as part of our Database Management Systems course,
                            demonstrating advanced concepts in database design, web development, and user experience. The project showcases
                            modern web technologies with beautiful animations, responsive design, and intuitive user interfaces.
                        </p>

                        <div className="tech-stack">
                            <span className="tech-item">React.js</span>
                            <span className="tech-item">Node.js</span>
                            <span className="tech-item">PostgreSQL</span>
                            <span className="tech-item">Express.js</span>
                            <span className="tech-item">CSS3 Animations</span>
                            <span className="tech-item">Responsive Design</span>
                            <span className="tech-item">REST APIs</span>
                        </div>
                    </div>

                    <div className="copyright">
                        © 2025 PulsePoint Health Management System.
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WelcomePage;
