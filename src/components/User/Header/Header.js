import React, { useState, useEffect, useRef } from 'react';
import logo from '../../../assests/logo2.png';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeInternship, setActiveInternship] = useState(null);
  const [isCoursesHovered, setIsCoursesHovered] = useState(false);
  const [isInternshipHovered, setIsInternshipHovered] = useState(false);
  const [coursesDropdownPosition, setCoursesDropdownPosition] = useState({ left: 0, top: 0 });
  const [internshipDropdownPosition, setInternshipDropdownPosition] = useState({ left: 0, top: 0 });
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    domain: '',
    numofstudents: '',
    experienceLevel: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const coursesRef = useRef(null);
  const internshipRef = useRef(null);
  const coursesDropdownRef = useRef(null);
  const internshipDropdownRef = useRef(null);

  // Courses data structure with descriptions
  const coursesData = {
    "Web Development": {
      title: "Web Development",
      items: [
        { name: "Frontend Development", description: "Learn HTML, CSS, JavaScript, React and build modern web interfaces" },
        { name: "Backend Development", description: "Master server-side programming with Node.js, Python, Java and databases" },
        { name: "Full Stack Development", description: "End-to-end web development with both frontend and backend technologies" }
      ]
    },
    "Mobile App Development": {
      title: "Mobile App Development",
      items: [
        { name: "Flutter Development", description: "Create beautiful, fast, and cross-platform mobile applications using Flutter and Dart" },
        { name: "Kotlin Development", description: "Build modern, efficient, and native Android applications using Kotlin and Jetpack libraries" },
      ]
    },
    "AI / ML": {
      title: "AI & Machine Learning",
      items: [
        { name: "AI & ML Course", description: "Comprehensive AI and Machine Learning with Python and frameworks" },
        { name: "AI and Data Science", description: "Intersection of AI techniques with data science applications" },
        { name: "ML and Data Analytics", description: "Machine learning algorithms for predictive analytics and insights" },
        { name: "Deep Learning", description: "Neural networks, TensorFlow, PyTorch for advanced AI applications" }
      ]
    },
  };

  // Internship data structure
  const internshipData = {
    "Web Development Internship": {
      title: "Web Development Internship",
      items: [
        { name: "Frontend Development Internship", description: "Hands-on experience with React, Vue, Angular and modern frontend technologies" },
        { name: "Backend Development Internship", description: "Real-world backend development with Node.js, Python, databases and APIs" },
        { name: "Full Stack Development Internship", description: "End-to-end web application development with both frontend and backend" }
      ]
    },
    "Mobile App Development Internship": {
      title: "Mobile App Development Internship",
      items: [
        { name: "Flutter Development Internship", description: "Build cross-platform mobile apps with Flutter, Dart and Firebase" },
        { name: "Kotlin Development Internship", description: "Native Android app development with Kotlin, Jetpack Compose and Material Design" },
      ]
    },
    "AI & ML Internship": {
      title: "AI & ML Internship",
      items: [
        { name: "Machine Learning Internship", description: "Practical ML projects with Python, TensorFlow, and real-world datasets" },
        { name: "Deep Learning Internship", description: "Neural networks, computer vision, and NLP projects with PyTorch" },
        { name: "AI Development Internship", description: "Build intelligent applications with AI algorithms and cloud AI services" }
      ]
    },
    "Data Science Internship": {
      title: "Data Science Internship",
      items: [
        { name: "Data Analysis Internship", description: "Data cleaning, analysis, and visualization with Python, Pandas, and SQL" },
        { name: "Business Intelligence Internship", description: "Create dashboards and reports with Tableau, Power BI, and data storytelling" },
        { name: "Statistical Analysis Internship", description: "Advanced statistical modeling, hypothesis testing, and data interpretation" }
      ]
    },
    "Data Analytics Internship": {
      title: "Data Analytics Internship",
      items: [
        { name: "Data Visualization Internship", description: "Create interactive dashboards and data visualizations with modern tools" },
        { name: "Predictive Analytics Internship", description: "Forecasting and predictive modeling with machine learning techniques" },
        { name: "Big Data Analytics Internship", description: "Work with large datasets using Spark, Hadoop, and cloud analytics platforms" }
      ]
    }
  };

  // Domain options for dropdown
  const domainOptions = [
    'Full Stack Development',
    'Frontend Development',
    'Backend Development',
    'Mobile App Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Cloud Computing',
    'DevOps',
    'Cyber Security',
    'UI/UX Design',
    'Digital Marketing',
    'Other'
  ];

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scroll and escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isOpen) setIsOpen(false);
        if (showHireModal) setShowHireModal(false);
        if (showSuccessModal) setShowSuccessModal(false);
        setActiveCourse(null);
        setActiveInternship(null);
        setIsCoursesHovered(false);
        setIsInternshipHovered(false);
      }
    };

    if (isOpen || showHireModal || showSuccessModal) {
      document.body.classList.add('no-scroll');
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, showHireModal, showSuccessModal]);

  const calculateDropdownPosition = (ref, setPosition) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dropdownWidth = 1000;
      const dropdownHeight = 500;
      
      // Calculate horizontal center
      const left = Math.max(20, (viewportWidth - dropdownWidth) / 2);
      
      // Calculate vertical position - below the navbar with some margin
      const top = rect.bottom + 10;
      
      // Ensure dropdown doesn't go below viewport
      const maxTop = viewportHeight - dropdownHeight - 20;
      const adjustedTop = Math.min(top, maxTop);
      
      setPosition({ 
        left: Math.floor(left), 
        top: Math.floor(adjustedTop) 
      });
    }
  };

  // Handle window resize and scroll to reposition dropdowns
  useEffect(() => {
    const handleResize = () => {
      if (isCoursesHovered) {
        calculateDropdownPosition(coursesRef, setCoursesDropdownPosition);
      }
      if (isInternshipHovered) {
        calculateDropdownPosition(internshipRef, setInternshipDropdownPosition);
      }
    };

    const handleScroll = () => {
      if (isCoursesHovered) {
        calculateDropdownPosition(coursesRef, setCoursesDropdownPosition);
      }
      if (isInternshipHovered) {
        calculateDropdownPosition(internshipRef, setInternshipDropdownPosition);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isCoursesHovered, isInternshipHovered]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleNavClick = (item) => {
    if (item === 'home') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'hire with us') {
      setShowHireModal(true);
    } else {
      // Close mobile menu first, then scroll after a brief delay
      setIsOpen(false);
      setTimeout(() => {
        scrollToSection(item);
      }, 400);
      return;
    }
    setIsOpen(false);
    setActiveCourse(null);
    setActiveInternship(null);
    setIsCoursesHovered(false);
    setIsInternshipHovered(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setActiveCourse(null);
    setActiveInternship(null);
    setIsCoursesHovered(false);
    setIsInternshipHovered(false);
  };

  const closeOffcanvas = () => {
    setIsOpen(false);
    setActiveCourse(null);
    setActiveInternship(null);
    setIsCoursesHovered(false);
    setIsInternshipHovered(false);
  };

  // Courses handlers
  const handleCoursesEnter = () => {
    // Close internship first
    setIsInternshipHovered(false);
    setActiveInternship(null);
    
    // Open courses
    setIsCoursesHovered(true);
    setActiveCourse('courses');
    requestAnimationFrame(() => {
      calculateDropdownPosition(coursesRef, setCoursesDropdownPosition);
    });
  };

  const handleCoursesLeave = () => {
    setIsCoursesHovered(false);
    setTimeout(() => {
      if (!isCoursesHovered) {
        setActiveCourse(null);
      }
    }, 300);
  };

  const handleCoursesDropdownEnter = () => {
    setIsCoursesHovered(true);
  };

  const handleCoursesDropdownLeave = () => {
    setIsCoursesHovered(false);
    setActiveCourse(null);
  };

  // Internship handlers
  const handleInternshipEnter = () => {
    // Close courses first
    setIsCoursesHovered(false);
    setActiveCourse(null);
    
    // Open internship
    setIsInternshipHovered(true);
    setActiveInternship('internship');
    requestAnimationFrame(() => {
      calculateDropdownPosition(internshipRef, setInternshipDropdownPosition);
    });
  };

  const handleInternshipLeave = () => {
    setIsInternshipHovered(false);
    setTimeout(() => {
      if (!isInternshipHovered) {
        setActiveInternship(null);
      }
    }, 300);
  };

  const handleInternshipDropdownEnter = () => {
    setIsInternshipHovered(true);
  };

  const handleInternshipDropdownLeave = () => {
    setIsInternshipHovered(false);
    setActiveInternship(null);
  };

  const handleCourseHover = (courseKey) => {
    setActiveCourse(courseKey);
  };

  const handleInternshipHover = (internshipKey) => {
    setActiveInternship(internshipKey);
  };

  const handleCourseClick = (courseName) => {
    console.log('Selected course:', courseName);
    setIsOpen(false);
    setActiveCourse(null);
    setIsCoursesHovered(false);
  };

  const handleInternshipClick = (internshipName) => {
    navigate('/application');
    console.log('Selected internship:', internshipName);
    setIsOpen(false);
    setActiveInternship(null);
    setIsInternshipHovered(false);
  };

  const handleMobileCourseClick = (courseKey) => {
    setActiveCourse(activeCourse === courseKey ? null : courseKey);
  };

  const handleMobileInternshipClick = (internshipKey) => {
    setActiveInternship(activeInternship === internshipKey ? null : internshipKey);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(formData)

    try {
      const res = await axios.post('https://testing12-3ebu.onrender.com/api/hire/wanthiring', formData);
      
      if(res.status === 200 || res.status === 201){
        setShowHireModal(false);
        setShowSuccessModal(true);
        setFormData({
          companyName: '',
          companyEmail: '',
          companyPhone: '',
          domain: '',
          numofstudents: '',
          experienceLevel: '',
          message: ''
        });
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modals
  const closeHireModal = () => {
    setShowHireModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <nav className={`header-nav ${scrolled ? 'header-nav--scrolled' : ''}`}>
        <div className="header-container">
          {/* Brand */}
          <div className="header-brand">
            <span className="header-brand-text">
              <Link to="/" onClick={closeOffcanvas}>
                <img src={logo} alt="Logo" width={120} />
              </Link>
            </span>
          </div>

          {/* Enhanced Toggler */}
          <button
            className={`header-toggler ${isOpen ? 'active' : ''}`}
            type="button"
            onClick={handleToggle}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            <span className="header-toggler-icon"></span>
          </button>

          {/* Enhanced Navigation Links with Offcanvas */}
          <div className={`header-collapse ${isOpen ? 'show' : ''}`}>
            <ul className="header-nav-list">
              {['home', 'about'].map((item) => (
                <li key={item} className="header-nav-item">
                  <button
                    className="header-nav-link"
                    onClick={() => handleNavClick(item)}
                    aria-label={`Navigate to ${item}`}
                  >
                    {item}
                  </button>
                </li>
              ))}
              
              {/* Courses Dropdown - Desktop */}
              <li 
                ref={coursesRef}
                className="header-nav-item courses-dropdown"
                onMouseEnter={handleCoursesEnter}
                onMouseLeave={handleCoursesLeave}
              >
                <button
                  className="header-nav-link"
                  aria-label="Browse courses"
                >
                  courses
                </button>
              </li>

              {/* Internship Dropdown - Desktop */}
              <li 
                ref={internshipRef}
                className="header-nav-item internship-dropdown"
                onMouseEnter={handleInternshipEnter}
                onMouseLeave={handleInternshipLeave}
              >
                <button
                  className="header-nav-link"
                  aria-label="Browse internships"
                >
                  internship
                </button>
              </li>

              {['projects', 'hire with us', 'apply', 'contact'].map((item) => (
                <li key={item} className="header-nav-item">
                  <button
                    className="header-nav-link"
                    onClick={() => handleNavClick(item)}
                    aria-label={`Navigate to ${item}`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile Courses Accordion */}
            {isOpen && (
              <div className="mobile-courses-accordion">
                <h3 className="mobile-courses-title">All Courses</h3>
                {Object.entries(coursesData).map(([courseKey, courseData]) => (
                  <div 
                    key={courseKey} 
                    className={`mobile-course-category ${
                      activeCourse === courseKey ? 'active' : ''
                    }`}
                  >
                    <button
                      className="mobile-course-header"
                      onClick={() => handleMobileCourseClick(courseKey)}
                    >
                      <span>{courseData.title}</span>
                      <span className="mobile-course-arrow">
                        {activeCourse === courseKey ? '−' : '+'}
                      </span>
                    </button>
                    <div className="mobile-course-content">
                      {courseData.items.map((item, index) => (
                        <div key={index} className="mobile-course-item">
                          <h4 className="mobile-course-item-title">{item.name}</h4>
                          <p className="mobile-course-item-description">{item.description}</p>
                          <button 
                            className="mobile-course-item-button"
                            onClick={() => handleCourseClick(item.name)}
                          >
                            View Course
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <h3 className="mobile-courses-title" style={{marginTop: '2rem'}}>Internship Programs</h3>
                {Object.entries(internshipData).map(([internshipKey, internshipDataItem]) => (
                  <div 
                    key={internshipKey} 
                    className={`mobile-course-category ${
                      activeInternship === internshipKey ? 'active' : ''
                    }`}
                  >
                    <button
                      className="mobile-course-header"
                      onClick={() => handleMobileInternshipClick(internshipKey)}
                    >
                      <span>{internshipDataItem.title}</span>
                      <span className="mobile-course-arrow">
                        {activeInternship === internshipKey ? '−' : '+'}
                      </span>
                    </button>
                    <div className="mobile-course-content">
                      {internshipDataItem.items.map((item, index) => (
                        <div key={index} className="mobile-course-item">
                          <h4 className="mobile-course-item-title">{item.name}</h4>
                          <p className="mobile-course-item-description">{item.description}</p>
                          <button 
                            className="mobile-course-item-button"
                            onClick={() => handleInternshipClick(item.name)}
                          >
                            View Internship
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Overlay */}
          {isOpen && (
            <div 
              className="header-overlay show" 
              onClick={closeOffcanvas}
              aria-hidden="true"
            />
          )}
        </div>
      </nav>

      {/* Centered Courses Mega Dropdown */}
      {(activeCourse === 'courses' || isCoursesHovered) && (
        <div 
          ref={coursesDropdownRef}
          className="courses-mega-dropdown"
          style={{
            left: `${coursesDropdownPosition.left}px`,
            top: `${coursesDropdownPosition.top}px`
          }}
          onMouseEnter={handleCoursesDropdownEnter}
          onMouseLeave={handleCoursesDropdownLeave}
        >
          <div className="courses-sidebar">
            <h3 className="courses-sidebar-title">All Courses</h3>
            <ul className="courses-sidebar-list">
              {Object.keys(coursesData).map((courseKey) => (
                <li 
                  key={courseKey}
                  className={`sidebar-course-item ${
                    activeCourse === courseKey ? 'active' : ''
                  }`}
                  onMouseEnter={() => handleCourseHover(courseKey)}
                >
                  <button className="sidebar-course-link">
                    {coursesData[courseKey].title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="courses-content">
            {Object.entries(coursesData).map(([courseKey, courseData]) => (
              <div 
                key={courseKey}
                className={`course-content-panel ${
                  activeCourse === courseKey ? 'active' : ''
                }`}
              >
                <h3 className="course-content-title">{courseData.title}</h3>
                <div className="course-subitems-grid">
                  {courseData.items.map((item, index) => (
                    <div key={index} className="course-subitem-card">
                      <h4 className="subitem-title">{item.name}</h4>
                      <p className="subitem-description">{item.description}</p>
                      <button 
                        className="subitem-button"
                        onClick={() => handleCourseClick(item.name)}
                      >
                        Learn More
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Centered Internship Mega Dropdown */}
      {(activeInternship === 'internship' || isInternshipHovered) && (
        <div 
          ref={internshipDropdownRef}
          className="courses-mega-dropdown internship-mega-dropdown"
          style={{
            left: `${internshipDropdownPosition.left}px`,
            top: `${internshipDropdownPosition.top}px`
          }}
          onMouseEnter={handleInternshipDropdownEnter}
          onMouseLeave={handleInternshipDropdownLeave}
        >
          <div className="courses-sidebar">
            <h3 className="courses-sidebar-title">Internship Programs</h3>
            <ul className="courses-sidebar-list">
              {Object.keys(internshipData).map((internshipKey) => (
                <li 
                  key={internshipKey}
                  className={`sidebar-course-item ${
                    activeInternship === internshipKey ? 'active' : ''
                  }`}
                  onMouseEnter={() => handleInternshipHover(internshipKey)}
                >
                  <button className="sidebar-course-link">
                    {internshipData[internshipKey].title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="courses-content">
            {Object.entries(internshipData).map(([internshipKey, internshipDataItem]) => (
              <div 
                key={internshipKey}
                className={`course-content-panel ${
                  activeInternship === internshipKey ? 'active' : ''
                }`}
              >
                <h3 className="course-content-title">{internshipDataItem.title}</h3>
                <div className="course-subitems-grid">
                  {internshipDataItem.items.map((item, index) => (
                    <div key={index} className="course-subitem-card">
                      <h4 className="subitem-title">{item.name}</h4>
                      <p className="subitem-description">{item.description}</p>
                      <button 
                        className="subitem-button"
                        onClick={() => handleInternshipClick(item.name)}
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hire with Us Modal */}
      {showHireModal && (
        <div className="modal-overlay" onClick={closeHireModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Hire Our Students</h2>
              <button 
                className="modal-close" 
                onClick={closeHireModal}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                Connect with our talented students and graduates. Fill out the form below and we'll help you find the perfect candidates for your organization.
              </p>

              <form onSubmit={handleSubmit} className="hire-form">
                <div className="form-group">
                  <label htmlFor="companyName">Company Name *</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="companyPhone"
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="domain">Domain Required *</label>
                  <select
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a domain</option>
                    {domainOptions.map((domain, index) => (
                      <option key={index} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="studentCount">Number of Students Needed *</label>
                  <input
                    type="number"
                    id="studentCount"
                    name="numofstudents"
                    value={formData.numofstudents}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="How many students are you looking for?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experienceLevel">Experience</label>
                  <input
                    type="text"
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    required
                    placeholder="Experience level required"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter additional details or requirements"
                    rows="4"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={closeHireModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={closeSuccessModal}>
          <div className="modal-content successs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="successs-modal-content">
              <div className="successs-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="#10B981" fillOpacity="0.1"/>
                  <path 
                    d="M28 32L31 35L36 29" 
                    stroke="#10B981" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <circle cx="32" cy="32" r="30" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4"/>
                </svg>
              </div>
              
              <h2 className="successs-title">Request Submitted Successfully!</h2>
              
              <p className="successs-message">
                Thank you for your interest in hiring our students. Our team will contact you within 24 hours to discuss your requirements and match you with the perfect candidates.
              </p>

              <div className="successs-details">
                <div className="successs-detail">
                  <span className="detail-label">What happens next?</span>
                  <ul className="detail-list">
                    <li>Our team will review your requirements</li>
                    <li>We'll shortlist matching candidates</li>
                    <li>Schedule interviews at your convenience</li>
                    <li>Provide ongoing support throughout the process</li>
                  </ul>
                </div>
              </div>

              <div className="successs-actions">
                <button
                  className="btn-primary successs-btn"
                  onClick={closeSuccessModal}
                >
                  Got It
                </button>
              </div>

              <p className="successs-note">
                Need immediate assistance? <a href="tel:+1234567890">Call us at 9444369625</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;