// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    
    // Cookie Banner
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    
    // Check if cookie was already accepted
    if (localStorage.getItem('cookieAccepted')) {
        cookieBanner.classList.add('hidden');
    }
    
    cookieAccept.addEventListener('click', function() {
        cookieBanner.classList.add('hidden');
        localStorage.setItem('cookieAccepted', 'true');
    });
    
    // Mobile Menu
    const menuBtn = document.getElementById('menuBtn');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    function openMenu() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    menuBtn.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Close menu on link click
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(acc => {
                acc.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Keyboard keys interaction
    const keys = document.querySelectorAll('.key-inline, .key-inline-sound, .key-inline-q, .key-box, .arrow-key');
    
    keys.forEach(key => {
        key.addEventListener('click', function() {
            // Add pressed effect
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Portfolio button scroll to projects
    const portfolioBtn = document.querySelector('.portfolio-btn');
    if (portfolioBtn) {
        portfolioBtn.addEventListener('click', function() {
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // CTA button scroll to contact
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Back to top
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Show success message
            alert('Спасибо! Ваша заявка отправлена. Я свяжусь с вами в ближайшее время.');
            this.reset();
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Observe pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });
    
    // SVG text animation
    const scriptTexts = document.querySelectorAll('.script-text, .script-text-small, .script-text-footer');
    scriptTexts.forEach(text => {
        const length = text.textContent.length * 100;
        text.style.strokeDasharray = length;
        text.style.strokeDashoffset = length;
        text.style.animation = 'drawText 2s ease forwards';
    });
    
    // Add draw animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes drawText {
            to {
                stroke-dashoffset: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Parallax effect for hero image
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            if (scrolled < 800) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Typing effect for keyboard section (optional enhancement)
    const keyboardTitle = document.querySelector('.keyboard-title');
    if (keyboardTitle) {
        // Add cursor effect
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.style.cssText = `
            display: inline-block;
            width: 3px;
            height: 1em;
            background: #252523;
            margin-left: 5px;
            animation: blink 1s infinite;
        `;
        
        const blinkStyle = document.createElement('style');
        blinkStyle.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(blinkStyle);
    }
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
