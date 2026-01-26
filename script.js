// ===== PORTFOLIO JAVASCRIPT FUNCTIONALITY =====
// ===== PRELOADER =====
// Add a preload class to the body to prevent FOUC
// document.body.classList.add('preload'); // Handled in HTML body tag

window.addEventListener('load', () => {
  document.body.classList.remove('preload');
});


// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section');

// ===== NAVBAR FUNCTIONALITY =====

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Smooth scroll to sections
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
                }
            });
        });
        
        // ===== SMOOTH SCROLLING =====
        
        // ===== NAVBAR SCROLL EFFECTS =====
        
        // Change navbar appearance on scroll
        function handleNavbarScroll() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        }

window.addEventListener('scroll', handleNavbarScroll);

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====

// Highlight active section in navigation
function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===== SCROLL ANIMATIONS =====

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections for animations
sections.forEach(section => {
    observer.observe(section);
});

// Observe skill cards, project cards, etc.
const animatedElements = document.querySelectorAll(
    '.skill-category, .project-card, .cert-item, .education-item, .experience-item'
);

animatedElements.forEach(element => {
    observer.observe(element);
});

// ===== TYPING ANIMATION FOR HERO SECTION =====

// Typing effect for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        typeWriter(heroSubtitle, originalText, 150);
    }
});

// ===== CONTACT FORM FUNCTIONALITY =====

// (function() {
//     // This check is important because emailjs might not be loaded
//     if (typeof emailjs !== 'undefined') {
//         // TODO: Replace with your public key
//         emailjs.init('YOUR_PUBLIC_KEY');
//     }
// })();

// Form validation and submission
function validateForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.get('firstName') || formData.get('firstName').trim().length < 2) {
        errors.push('Please enter a valid name (minimum 2 characters)');
    }
    
    // Email validation
    const emailRegex = /^[^S@]+@[^S@]+\.[^S@]+$/;
    if (!formData.get('email') || !emailRegex.test(formData.get('email'))) {
        errors.push('Please enter a valid email address');
    }
    
    // Message validation
    if (!formData.get('message') || formData.get('message').trim().length < 10) {
        errors.push('Please enter a message (minimum 10 characters)');
    }
    
    return errors;
}

// Show form feedback
function showFormFeedback(message, type = 'success') {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create new feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        animation: fadeInUp 0.5s ease-out;
    `;
    feedback.textContent = message;
    
    // Insert after form
    if (contactForm) {
        contactForm.appendChild(feedback);
    }
    
    // Remove feedback after 5 seconds
    setTimeout(() => {
        if (feedback) feedback.remove();
    }, 5000);
}

// Handle form submission
// Handle form submission
// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const fullName = `${firstName} ${lastName}`.trim();
    formData.set('fullName', fullName);
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        showFormFeedback(errors[0], 'error');
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success feedback
            showFormFeedback('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
            // Reset form
            contactForm.reset();
        } else {
            // Error feedback
            showFormFeedback('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
        }
        
    } catch (error) {
        showFormFeedback('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Add form event listener
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmission);
}

// ===== CV DOWNLOAD FUNCTIONALITY =====

// Track CV downloads
function trackCVDownload() {
    // Analytics tracking (optional)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'CV',
            'event_label': 'Resume PDF'
        });
    }
}

// Add event listener to CV download button
const cvDownloadBtn = document.querySelector('.btn-download');
if (cvDownloadBtn) {
    cvDownloadBtn.addEventListener('click', trackCVDownload);
}

// ===== SKILL BARS ANIMATION =====

// Animate skill level indicators when in view
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const skillLevel = item.querySelector('.skill-level');
        if (!skillLevel) return;
        const level = skillLevel.textContent;
        
        // Add progress bar animation based on skill level
        let percentage = 0;
        switch (level.toLowerCase()) {
            case 'advanced':
                percentage = 90;
                break;
            case 'intermediate':
                percentage = 70;
                break;
            case 'basic':
            case 'learning':
                percentage = 50;
                break;
            default:
                percentage = 60;
        }
        
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'skill-progress';
        progressBar.style.cssText = `
            height: 4px;
            background: #e2e8f0;
            border-radius: 2px;
            margin-top: 0.5rem;
            overflow: hidden;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.className = 'skill-progress-fill';
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #2563eb, #f59e0b);
            border-radius: 2px;
            width: 0%;
            transition: width 2s ease-out;
        `;
        
        progressBar.appendChild(progressFill);
        item.appendChild(progressBar);
        
        // Animate on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        progressFill.style.width = `${percentage}%`;
                    }, 500);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(item);
    });
}

// ===== PROJECT CARD INTERACTIONS =====

// Enhanced project card hover effects
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const image = card.querySelector('.project-image img');
        
        card.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

// ===== SCROLL TO TOP FUNCTIONALITY =====

// Create scroll to top button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 6rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
    `;
    
    // Show/hide on scroll
    function toggleScrollButton() {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    }
    
    // Scroll to top functionality
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effects
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'scale(1.1)';
        scrollBtn.style.background = '#f59e0b';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'scale(1)';
        scrollBtn.style.background = '#2563eb';
    });
    
    window.addEventListener('scroll', toggleScrollButton);
    document.body.appendChild(scrollBtn);
}

// ===== LAZY LOADING FOR IMAGES =====

// Lazy load images for better performance
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}


// ===== PERFORMANCE OPTIMIZATION =====

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedNavbarScroll = debounce(handleNavbarScroll, 10);
const debouncedActiveNavLink = debounce(updateActiveNavLink, 10);

window.removeEventListener('scroll', handleNavbarScroll);
window.removeEventListener('scroll', updateActiveNavLink);

window.addEventListener('scroll', debouncedNavbarScroll);
window.addEventListener('scroll', debouncedActiveNavLink);


// ===== Experience Modal Popup logic =====
function toggleDetails(btn) {
    // Find parent .experience-item
    const card = btn.closest('.experience-item');
    if (!card) return;
    // Get title, company, and details
    const title = card.querySelector('.experience-title')?.textContent || '';
    const company = card.querySelector('.company')?.textContent || '';
    const detailsList = card.querySelector('.experience-details');
    if (!detailsList) return;
    // Fill modal content
    document.getElementById('exp-modal-title').textContent = title;
    document.getElementById('exp-modal-company').textContent = company;
    const ul = document.getElementById('exp-modal-list');
    ul.innerHTML = '';
    detailsList.querySelectorAll('li').forEach(li => {
        const clone = li.cloneNode(true);
        // Remove arrows if they exist in the text content
        clone.textContent = clone.textContent.replace('→', '').trim();
        ul.appendChild(clone);
    });
    // Show modal
    document.getElementById('exp-modal').style.display = 'flex';
    document.body.classList.add('exp-modal-open');
}

function closeExpModal() {
    const modal = document.getElementById('exp-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('exp-modal-open');
    }
}


// ===== Accordion functionality for skills section =====
function toggleSkill(header) {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.accordion-content').style.maxHeight = '0px';
        }
    });
    // Toggle current
    if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
    } else {
        item.classList.remove('open');
        content.style.maxHeight = '0px';
    }
}


// ===== INITIALIZATION =====

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Force show nav toggle if it was hidden
    if (navToggle) {
        // navToggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
        navToggle.style.visibility = 'visible';
        navToggle.style.opacity = '1';
    }

    // Initialize features
    animateSkillBars();
    initProjectCards();
    createScrollToTopButton();
    initLazyLoading();
    
    document.body.classList.add('loaded');

    // Close modal logic
    const expModalClose = document.getElementById('exp-modal-close');
    if (expModalClose) {
        expModalClose.onclick = closeExpModal;
    }
    const expModalBlur = document.getElementById('exp-modal-blur');
    if (expModalBlur) {
        expModalBlur.onclick = closeExpModal;
    }

    // Contact form bubble animation
    const contactCard = document.querySelector('.contactus-info-card');
    if (contactCard) {
        const bubbles = Array.from(contactCard.querySelectorAll('.bubble'));
        const cardRect = () => contactCard.getBoundingClientRect();
        const bubbleStates = bubbles.map((el, i) => {
            const rect = cardRect();
            const w = el.offsetWidth, h = el.offsetHeight;
            const x = Math.random() * (rect.width - w);
            const y = Math.random() * (rect.height - h);
            let angle = Math.random() * Math.PI * 2;
            let speed = 0.5 + Math.random() * 0.7;
            return { el, x, y, r: Math.max(w, h) / 2, dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed, speed };
        });
        let mouse = { x: -1000, y: -1000 };
        contactCard.addEventListener('mousemove', e => {
            const rect = cardRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        contactCard.addEventListener('mouseleave', () => {
            mouse.x = -1000; mouse.y = -1000;
        });
        function animateBubbles() {
            const rect = cardRect();
            for (let b of bubbleStates) {
                b.x += b.dx;
                b.y += b.dy;
                if (b.x < 0) { b.x = 0; b.dx *= -1; }
                if (b.y < 0) { b.y = 0; b.dy *= -1; }
                if (b.x > rect.width - b.el.offsetWidth) { b.x = rect.width - b.el.offsetWidth; b.dx *= -1; }
                if (b.y > rect.height - b.el.offsetHeight) { b.y = rect.height - b.el.offsetHeight; b.dy *= -1; }
                const cx = b.x + b.el.offsetWidth / 2;
                const cy = b.y + b.el.offsetHeight / 2;
                const dist = Math.hypot(cx - mouse.x, cy - mouse.y);
                if (dist < b.r + 24) {
                    const angle = Math.atan2(cy - mouse.y, cx - mouse.x);
                    b.dx = Math.cos(angle) * b.speed;
                    b.dy = Math.sin(angle) * b.speed;
                    b.x += b.dx * 2;
                    b.y += b.dy * 2;
                }
                b.el.style.left = b.x + 'px';
                b.el.style.top = b.y + 'px';
                b.el.style.transform = 'none';
            }
            requestAnimationFrame(animateBubbles);
        }
        for (let b of bubbleStates) {
            b.el.style.position = 'absolute';
            b.el.style.transform = 'none';
        }
        animateBubbles();
    }
    
    // Contact form submission notification
    (function() {
        const form = document.getElementById('contactForm');
        const notif = document.getElementById('contact-notification');
        const emailInput = document.getElementById('email');
        if (!form || !notif || !emailInput) return;
        emailInput.addEventListener('input', function() {
            const email = emailInput.value.trim().toLowerCase();
            let sentEmails = [];
            try {
                sentEmails = JSON.parse(localStorage.getItem('sentContactEmails') || '[]');
            } catch {}
            if (email && sentEmails.includes(email)) {
                notif.textContent = 'You have already sent a message with this email.';
                notif.style.display = 'block';
                notif.style.opacity = '0.95';
            } else {
                notif.style.opacity = '0';
                setTimeout(() => { notif.style.display = 'none'; }, 200);
            }
        });
        form.addEventListener('submit', function(e) {
            const email = emailInput.value.trim().toLowerCase();
            if (!email) return;
            let sentEmails = [];
            try {
                sentEmails = JSON.parse(localStorage.getItem('sentContactEmails') || '[]');
            } catch {}
            if (sentEmails.includes(email)) {
                notif.textContent = 'You have already sent a message with this email.';
                notif.style.display = 'block';
                notif.style.opacity = '0.95';
                setTimeout(() => { notif.style.opacity = '0'; setTimeout(() => { notif.style.display = 'none'; }, 400); }, 2600);
            }
            if (!sentEmails.includes(email)) {
                sentEmails.push(email);
                localStorage.setItem('sentContactEmails', JSON.stringify(sentEmails));
            }
        });
    })();

    // Footer bubble animation
    const footerCard = document.querySelector('.site-footer');
    if (footerCard) {
        const bubbles = Array.from(footerCard.querySelectorAll('.bubble'));
        const cardRect = () => footerCard.getBoundingClientRect();
        const bubbleStates = bubbles.map((el, i) => {
            const rect = cardRect();
            const w = el.offsetWidth, h = el.offsetHeight;
            const x = Math.random() * (rect.width - w);
            const y = Math.random() * (rect.height - h);
            let angle = Math.random() * Math.PI * 2;
            let speed = 0.5 + Math.random() * 0.7;
            return { el, x, y, r: Math.max(w, h) / 2, dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed, speed };
        });
        let mouse = { x: -1000, y: -1000 };
        footerCard.addEventListener('mousemove', e => {
            const rect = cardRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        footerCard.addEventListener('mouseleave', () => {
            mouse.x = -1000; mouse.y = -1000;
        });
        function animateFooterBubbles() {
            const rect = cardRect();
            for (let b of bubbleStates) {
                b.x += b.dx;
                b.y += b.dy;
                if (b.x < 0) { b.x = 0; b.dx *= -1; }
                if (b.y < 0) { b.y = 0; b.dy *= -1; }
                if (b.x > rect.width - b.el.offsetWidth) { b.x = rect.width - b.el.offsetWidth; b.dx *= -1; }
                if (b.y > rect.height - b.el.offsetHeight) { b.y = rect.height - b.el.offsetHeight; b.dy *= -1; }
                const cx = b.x + b.el.offsetWidth / 2;
                const cy = b.y + b.el.offsetHeight / 2;
                const dist = Math.hypot(cx - mouse.x, cy - mouse.y);
                if (dist < b.r + 24) {
                    const angle = Math.atan2(cy - mouse.y, cx - mouse.x);
                    b.dx = Math.cos(angle) * b.speed;
                    b.dy = Math.sin(angle) * b.speed;
                    b.x += b.dx * 2;
                    b.y += b.dy * 2;
                }
                b.el.style.left = b.x + 'px';
                b.el.style.top = b.y + 'px';
                b.el.style.transform = 'none';
            }
            requestAnimationFrame(animateFooterBubbles);
        }
        for (let b of bubbleStates) {
            b.el.style.position = 'absolute';
            b.el.style.transform = 'none';
        }
        animateFooterBubbles();
    }
    
    // Skills accordion - start with all closed
    document.querySelectorAll('.accordion-content').forEach(content => {
        content.style.maxHeight = '0px';
    });
});

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', (e) => {
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
});

// ===== UTILITY FUNCTIONS =====

// Utility: Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Utility: Get CSS variable value
function getCSSVariable(variable) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

// Utility: Set CSS variable value
function setCSSVariable(variable, value) {
    document.documentElement.style.setProperty(variable, value);
}

// ===== CONSOLE STYLING =====

// ===== EXPORT FOR TESTING (IF NEEDED) =====

// Expose functions for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        debounce,
        isInViewport
    };
}