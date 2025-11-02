// Section Navigation
let currentSection = 0;
const sections = document.querySelectorAll('.portfolio-section');
let isScrolling = false;

// Initialize Galaxy Scene
function init3D() {
    const canvas = document.getElementById('canvas3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Optimize for mobile
    const isMobile = window.innerWidth < 768;
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio;
    renderer.setPixelRatio(pixelRatio);
    
    // Galaxy parameters - adjust for mobile
    const galaxyParams = {
        count: isMobile ? 3000 : 8000,
        size: isMobile ? 0.04 : 0.03,
        radius: 50,
        branches: 8,
        spin: 0.5,
        randomness: 0.4,
        randomnessPower: 3,
        insideColor: '#6366f1',
        outsideColor: '#8b5cf6'
    };
    
    let galaxyGeometry = null;
    let galaxyMaterial = null;
    let galaxyPoints = null;
    
    // Create galaxy
    function createGalaxy() {
        // Dispose old galaxy
        if (galaxyPoints !== null) {
            galaxyGeometry.dispose();
            galaxyMaterial.dispose();
            scene.remove(galaxyPoints);
        }
        
        // Create geometry
        galaxyGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(galaxyParams.count * 3);
        const colors = new Float32Array(galaxyParams.count * 3);
        const scales = new Float32Array(galaxyParams.count);
        
        const insideColor = new THREE.Color(galaxyParams.insideColor);
        const outsideColor = new THREE.Color(galaxyParams.outsideColor);
        
        for (let i = 0; i < galaxyParams.count; i++) {
            const i3 = i * 3;
            
            // Position
            const radius = Math.random() * galaxyParams.radius;
            const spinAngle = radius * galaxyParams.spin;
            const branchAngle = (i % galaxyParams.branches) / galaxyParams.branches * Math.PI * 2;
            
            const randomX = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
            const randomY = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
            const randomZ = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
            
            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
            
            // Color
            const mixedColor = insideColor.clone();
            mixedColor.lerp(outsideColor, radius / galaxyParams.radius);
            
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
            
            // Scale
            scales[i] = Math.random();
        }
        
        galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        galaxyGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        
        // Create material
        galaxyMaterial = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            transparent: true,
            vertexShader: `
                attribute float scale;
                varying vec3 vColor;
                
                void main() {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    
                    gl_Position = projectedPosition;
                    gl_PointSize = scale * ${galaxyParams.size};
                    gl_PointSize *= (1.0 / -viewPosition.z);
                    
                    vColor = color;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float strength = 0.05 / distanceToCenter - 0.1;
                    strength = clamp(strength, 0.0, 1.0);
                    
                    vec3 color = mix(vec3(0.0), vColor, strength);
                    gl_FragColor = vec4(color, strength);
                }
            `
        });
        
        // Create points
        galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
        scene.add(galaxyPoints);
    }
    
    // Initial galaxy creation
    createGalaxy();
    
    // Camera position
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 30;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate galaxy slowly
        if (galaxyPoints) {
            galaxyPoints.rotation.y += 0.0005;
        }
        
        // Camera movement based on scroll - black hole effect
        const scrollProgress = getCurrentSection();
        const totalSections = sections.length - 1;
        const progress = scrollProgress / totalSections;
        
        // Move camera through the galaxy
        camera.position.y = progress * 10 - 5;
        camera.position.x = Math.sin(progress * Math.PI * 2) * 5;
        camera.position.z = 30 + Math.sin(progress * Math.PI) * 20;
        
        // Add rotation effect as we travel through
        if (galaxyPoints) {
            galaxyPoints.rotation.z += 0.0003 * (progress + 0.5);
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Adjust pixel ratio for mobile
        const isMobile = window.innerWidth < 768;
        const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio;
        renderer.setPixelRatio(pixelRatio);
    });
}

// Get current section
function getCurrentSection() {
    return currentSection;
}

// Code snippets for transitions
const codeSnippets = [
    'const portfolio = new Portfolio();',
    'function createGalaxy() { ... }',
    'class Developer { ... }',
    'const skills = ["JS", "CSS", "Three.js"];',
    'async function buildProject() { ... }',
    'import { Galaxy } from "universe";',
    'const code = { magic: true };',
    'function enterNewUniverse() { ... }',
    'const projects = [...awesome];',
    '<section data-3d="true"></section>',
    'renderer.render(scene, camera);',
    'transform: matrix3d(1, 0, 0, 0...);'
];

// Show code transition animation
function showCodeTransition() {
    const codeOverlay = document.getElementById('code-transition');
    const codeLines = codeOverlay.querySelector('.code-lines');
    
    if (!codeOverlay || !codeLines) return;
    
    // Activate overlay
    codeOverlay.classList.add('active');
    
    // Clear previous code
    codeLines.innerHTML = '';
    
    // Generate random code lines
    const lineCount = 10;
    
    // Shuffle snippets array for variety
    const shuffledSnippets = [...codeSnippets].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < lineCount; i++) {
        const codeLine = document.createElement('div');
        codeLine.className = 'code-line';
        
        // Get random snippet with fallback
        let snippet = shuffledSnippets[i % shuffledSnippets.length];
        if (i >= shuffledSnippets.length) {
            snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        }
        
        codeLine.textContent = snippet;
        codeLine.style.animationDelay = `${i * 0.2}s`;
        codeLines.appendChild(codeLine);
    }
    
    // Remove overlay after animation
    setTimeout(() => {
        codeOverlay.classList.remove('active');
        setTimeout(() => {
            codeLines.innerHTML = '';
        }, 500);
    }, 2000);
}

// Scroll to specific section
function scrollToSection(index) {
    if (index < 0 || index >= sections.length || isScrolling) return;
    
    isScrolling = true;
    
    // Show code transition
    showCodeTransition();
    
    // Small delay before section transition
    setTimeout(() => {
        // Remove active from all sections
        sections.forEach((section, i) => {
            section.classList.remove('active', 'prev');
            if (i < index) {
                section.classList.add('prev');
            }
        });
        
        // Add active to current section
        sections[index].classList.add('active');
        
        currentSection = index;
        updateNavbar(index);
        
        // Allow scrolling again after animation
        setTimeout(() => {
            isScrolling = false;
        }, 1600);
    }, 100);
}

function updateNavbar(index) {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach((link, i) => {
        if (i === index) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (index === sections.length - 1) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
    }
    
    // Add star animations to sections
    sections.forEach((section, i) => {
        if (i === index && i !== 0) {
            section.classList.add('star-animate');
        } else {
            section.classList.remove('star-animate');
        }
    });
}

function goToNextSection() {
    if (currentSection < sections.length - 1 && !isScrolling) {
        scrollToSection(currentSection + 1);
    }
}

function goToPrevSection() {
    if (currentSection > 0 && !isScrolling) {
        scrollToSection(currentSection - 1);
    }
}

// Wheel scroll with snapping
let wheelTimeout;

window.addEventListener('wheel', (e) => {
    if (isScrolling) {
        e.preventDefault();
        return;
    }
    
    clearTimeout(wheelTimeout);
    
    wheelTimeout = setTimeout(() => {
        const scrollThreshold = 50;
        
        if (e.deltaY > scrollThreshold) {
            e.preventDefault();
            goToNextSection();
        } else if (e.deltaY < -scrollThreshold) {
            e.preventDefault();
            goToPrevSection();
        }
    }, 100);
}, { passive: false });

// Keyboard navigation
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToNextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevSection();
    }
});

// Navbar link clicks
document.querySelectorAll('.navbar-nav .nav-link').forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection(index);
    });
});

// Touch/swipe support for mobile
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;

window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
}, { passive: true });

window.addEventListener('touchend', (e) => {
    if (isScrolling) return;
    
    touchEndY = e.changedTouches[0].screenY;
    const touchDuration = Date.now() - touchStartTime;
    handleSwipe(touchDuration);
}, { passive: true });

function handleSwipe(duration) {
    const swipeThreshold = 50;
    const minSwipeDuration = 100;
    const maxSwipeDuration = 500;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold && duration > minSwipeDuration && duration < maxSwipeDuration) {
        if (diff > 0) {
            // Swiped up - go to next section
            goToNextSection();
        } else {
            // Swiped down - go to previous section
            goToPrevSection();
        }
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const contentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-box, .project-card, .project-card-main, .contact-box, .languages-container, .cv-download-box').forEach((el, index) => {
    // Add staggered delay
    el.style.transitionDelay = `${index * 0.1}s`;
    contentObserver.observe(el);
});

// Progress bar animation
const progressBars = document.querySelectorAll('.progress-bar');
const animateProgressBars = () => {
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
};

// Animate progress bars when about section is visible
const aboutSection = document.getElementById('about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
        }
    });
}, { threshold: 0.5 });

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init3D();
    updateNavbar(0);
    
    // Activate first section
    sections[0].classList.add('active');
    
    // Observe about section
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
    
    // Handle navigation links from home buttons
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                
                // Find the section with this ID and get its index
                sections.forEach((section, index) => {
                    if (section.id === targetId) {
                        e.preventDefault();
                        scrollToSection(index);
                    }
                });
            }
        });
    });
});

// Smooth scroll indicator click
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    goToNextSection();
});

// Project switching functionality
const projectsData = [
    {
        icon: 'fa-globe',
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration',
        tech: ['React', 'Node.js', 'Firebase'],
        subProjects: ['Product Catalog', 'Payment Gateway', 'User Dashboard']
    },
    {
        icon: 'fa-mobile-alt',
        title: 'Mobile App',
        description: 'Cross-platform mobile application',
        tech: ['Flutter', 'Firebase'],
        subProjects: ['AR Furniture', 'Property Listing', 'Social Features']
    },
    {
        icon: 'fa-cube',
        title: '3D Portfolio',
        description: 'Interactive 3D portfolio website',
        tech: ['Three.js', 'WebGL'],
        subProjects: ['3D Globe', 'Particle Effects', 'Scene Transitions']
    }
];

// Initialize project thumbnails
document.querySelectorAll('.project-thumbnail').forEach((thumbnail, index) => {
    contentObserver.observe(thumbnail);
    
    thumbnail.addEventListener('click', () => {
        // Update main project
        const project = projectsData[index];
        document.getElementById('main-icon').className = `fas ${project.icon}`;
        document.getElementById('main-title').textContent = project.title;
        document.getElementById('main-description').textContent = project.description;
        
        // Hide tech badges on mobile (sub-projects tags will show instead)
        const techContainer = document.getElementById('main-tech');
        techContainer.style.display = 'none';
        
        // Update sub-projects tags for mobile
        const subProjectsContainer = document.getElementById('main-sub-projects');
        if (subProjectsContainer && project.subProjects) {
            subProjectsContainer.innerHTML = project.subProjects.map(sub => `<span class="sub-project-tag">${sub}</span>`).join('');
            subProjectsContainer.style.display = 'flex';
        }
        
        // Update active state
        document.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
        
        // Add animation effect
        const mainProject = document.getElementById('main-project');
        mainProject.style.transform = 'scale(0.95)';
        setTimeout(() => {
            mainProject.style.transform = 'scale(1)';
        }, 150);
    });
});

// Desktop project card click handlers for sub-projects
document.querySelectorAll('.project-card[data-project-index]').forEach(card => {
    contentObserver.observe(card);
    
    card.addEventListener('click', () => {
        const projectIndex = card.getAttribute('data-project-index');
        const subProjectsContainer = document.querySelector(`.sub-projects-container[data-sub-projects="${projectIndex}"]`);
        const projectsSection = document.querySelector('#projects');
        const mainProjectRow = document.querySelector('.d-none.d-lg-block .row.g-4');
        
        // Close all other sub-project containers
        document.querySelectorAll('.sub-projects-container').forEach(container => {
            if (container !== subProjectsContainer) {
                container.style.display = 'none';
            }
        });
        
        // Toggle current sub-project container
        if (subProjectsContainer) {
            if (subProjectsContainer.style.display === 'none' || subProjectsContainer.style.display === '') {
                subProjectsContainer.style.display = 'block';
                subProjectsContainer.style.animation = 'slideDown 0.3s ease-out';
                // Add class to reduce main project card sizes
                if (projectsSection) projectsSection.classList.add('sub-projects-active');
                if (mainProjectRow) mainProjectRow.classList.add('compressed');
            } else {
                subProjectsContainer.style.display = 'none';
                // Remove class to restore main project card sizes
                if (projectsSection) projectsSection.classList.remove('sub-projects-active');
                if (mainProjectRow) mainProjectRow.classList.remove('compressed');
            }
        }
    });
});

// Language accordion toggle function
function toggleLanguageAccordion(button, type) {
    const isActive = button.classList.contains('active');
    
    // Close all accordion headers and content
    document.querySelectorAll('.language-accordion-header').forEach(header => {
        header.classList.remove('active');
    });
    document.querySelectorAll('.language-accordion-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // If this button wasn't active, open it
    if (!isActive) {
        button.classList.add('active');
        const content = document.querySelector(`.language-accordion-content[data-type="${type}"]`);
        if (content) {
            content.classList.add('active');
        }
    }
}

// Add observer for mobile languages container
document.querySelectorAll('.mobile-languages-container').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    contentObserver.observe(el);
});

// CV Download functionality
document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Ensure the download attribute works properly
        const href = this.getAttribute('href');
        if (href && href.endsWith('.pdf')) {
            // Allow the browser's native download behavior
            // The download attribute will handle it
            console.log('Downloading CV:', href);
        }
    });
});