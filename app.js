AOS.init({ duration: 1000, once: true, offset: 50 });

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. GLOWING ANTI-GRAVITY CANVAS PARTICLES ===
    const canvas = document.getElementById('particle-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        let mouse = { x: null, y: null, radius: 150 } // Increased repulse radius
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;

        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
        window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });
        window.addEventListener('touchmove', (event) => { mouse.x = event.touches[0].clientX; mouse.y = event.touches[0].clientY; });
        window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });
        window.addEventListener('touchend', () => { mouse.x = undefined; mouse.y = undefined; });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3; this.density = (Math.random() * 30) + 1; 
                // Random color between Cyan and Pink for particles
                this.color = Math.random() > 0.5 ? '#00e5ff' : '#ff007f';
            }
            update() {
                let dx = mouse.x - this.x; let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance; let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < mouse.radius) { this.x -= directionX; this.y -= directionY; } 
                else { this.y -= 0.5; this.x += (Math.random() * 0.5) - 0.25; }

                if (this.y < 0) { this.y = canvas.height; this.x = Math.random() * canvas.width; }
                if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                // Add Glow to Particles
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.closePath();
            }
        }
        function initParticles() {
            particlesArray = []; let numberOfParticles = (canvas.width * canvas.height) / 7000;
            for (let i = 0; i < numberOfParticles; i++) particlesArray.push(new Particle());
        }
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); particlesArray[i].draw(); }
            requestAnimationFrame(animateParticles);
        }
        initParticles(); animateParticles();
    }

    // === 2. ADVANCED CUSTOM CURSOR TRACKER ===
    if (window.innerWidth > 768) {
        const cursorDot = document.createElement('div'); cursorDot.className = 'cursor-dot';
        const cursorOutline = document.createElement('div'); cursorOutline.className = 'cursor-outline';
        document.body.appendChild(cursorDot); document.body.appendChild(cursorOutline);

        window.addEventListener('mousemove', function(e) {
            cursorDot.style.left = `${e.clientX}px`; cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 250, fill: "forwards" });
        });

        window.addEventListener('mousedown', () => cursorOutline.classList.add('cursor-click-expand'));
        window.addEventListener('mouseup', () => setTimeout(() => cursorOutline.classList.remove('cursor-click-expand'), 300));
        window.addEventListener('mouseout', () => { cursorOutline.style.opacity = 0; cursorDot.style.opacity = 0; });
        window.addEventListener('mouseover', () => { cursorOutline.style.opacity = 1; cursorDot.style.opacity = 1; });
    }

    // === 3. TOP PROGRESS BAR ===
    const progressContainer = document.createElement('div'); progressContainer.className = 'progress-container';
    progressContainer.innerHTML = '<div class="progress-bar" id="myBar"></div>'; document.body.prepend(progressContainer);
    window.onscroll = function() {
        let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        document.getElementById("myBar").style.width = (winScroll / height) * 100 + "%";
    };

    // === 4. INJECT DATA FROM data.js TO HTML ===
    document.getElementById('brand-logo').innerText = portfolioData.brandName;
    document.getElementById('dev-name').innerText = portfolioData.personalInfo.name;
    document.getElementById('dev-bio').innerText = portfolioData.personalInfo.bio;
    
    const profileImg = document.getElementById('dev-image');
    if(portfolioData.personalInfo.profileImage) profileImg.src = portfolioData.personalInfo.profileImage;

    const socialContainer = document.getElementById('social-container');
    if(socialContainer) {
        socialContainer.innerHTML = `
            <a href="${portfolioData.socialLinks.github}" target="_blank" title="GitHub"><i class="fa-brands fa-github"></i></a>
            <a href="${portfolioData.socialLinks.linkedin}" target="_blank" title="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
            <a href="${portfolioData.socialLinks.instagram}" target="_blank" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="${portfolioData.socialLinks.email}" title="Email"><i class="fa-solid fa-envelope"></i></a>
            <a href="${portfolioData.socialLinks.phone}" title="Call Me"><i class="fa-solid fa-phone"></i></a>
        `;
    }

    const skillsContainer = document.getElementById('skills-container');
    if(skillsContainer) {
        portfolioData.skills.forEach((skill, index) => {
            let span = document.createElement('span'); span.className = 'skill-tag'; span.innerText = skill;
            span.setAttribute('data-aos', 'fade-up'); span.setAttribute('data-aos-delay', (index % 10) * 50);
            skillsContainer.appendChild(span);
        });
    }

    const expContainer = document.getElementById('experience-container');
    if(expContainer) {
        portfolioData.experience.forEach((exp, index) => {
            let div = document.createElement('div'); div.className = 'exp-card glass-card';
            div.setAttribute('data-aos', 'fade-up'); div.setAttribute('data-aos-delay', (index % 3) * 100);
            div.innerHTML = `
                <div class="timeline-dot"></div>
                <h3>${exp.role} <br><span class="text-gradient" style="font-size:1.1rem; text-shadow: none;">@ ${exp.company}</span></h3>
                <span style="color:var(--text-muted); font-size:0.95rem; margin-bottom:15px; display:block;"><i class="fa-regular fa-calendar" style="color:var(--accent-glow);"></i> ${exp.duration}</span>
                <p>${exp.description}</p>
            `;
            expContainer.appendChild(div);
        });
    }

    const certContainer = document.getElementById('cert-container');
    if(certContainer) {
        portfolioData.certifications.forEach((cert, index) => {
            let li = document.createElement('li'); li.className = 'glass-card';
            li.setAttribute('data-aos', 'fade-right'); li.setAttribute('data-aos-delay', (index % 3) * 100);
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div style="display: flex; align-items: center;">
                        <i class="fa-solid fa-award text-gradient" style="font-size:1.6rem; margin-right: 15px; text-shadow: 0 0 10px var(--accent-glow);"></i> 
                        ${cert.name}
                    </div>
                    <a href="${cert.link}" target="_blank" class="btn" style="padding: 8px 18px; font-size: 0.9rem; border-radius: 8px;">View <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                </div>
            `;
            certContainer.appendChild(li);
        });
    }

    const projectsContainer = document.getElementById('projects-container');
    if(projectsContainer) {
        portfolioData.projects.forEach((proj, index) => {
            let div = document.createElement('div'); div.className = 'project-card glass-card';
            div.setAttribute('data-aos', 'zoom-in'); div.setAttribute('data-aos-delay', (index % 3) * 100);
            
            let buttonsHTML = '';
            if(proj.isDoubleLink) {
                buttonsHTML = `
                    <div class="project-links">
                        <a href="${proj.linkLive}" class="btn" target="_blank"><i class="fa-solid fa-globe"></i> Live Preview</a>
                        <a href="${proj.linkPDF}" class="btn btn-secondary" target="_blank"><i class="fa-solid fa-file-pdf"></i> View PDF</a>
                    </div>
                `;
            } else {
                buttonsHTML = `
                    <div class="project-links">
                        <a href="${proj.link}" class="btn" target="_blank"><i class="fa-solid fa-arrow-right"></i> View Project</a>
                    </div>
                `;
            }

            div.innerHTML = `
                <h3 style="text-shadow: 0 0 10px var(--accent-glow); color: #fff;">${proj.title}</h3>
                <p>${proj.description}</p>
                <p><strong>Tech:</strong> <span class="tech-stack">${proj.tech}</span></p>
                ${buttonsHTML}
            `;
            projectsContainer.appendChild(div);
        });
    }

    setTimeout(typeWriter, 1000);
});

// === 5. TYPEWRITER EFFECT ===
const roles = ["Software Developer", "Full-Stack Web Dev", "Backend Engineer", "Cloud Enthusiast"];
let roleIndex = 0; let charIndex = 0; let isDeleting = false; let typingSpeed = 100;

function typeWriter() {
    const roleElement = document.getElementById('dev-role');
    if (!roleElement) return;

    const currentRole = roles[roleIndex];
    if (isDeleting) { roleElement.innerHTML = currentRole.substring(0, charIndex - 1); charIndex--; typingSpeed = 40; } 
    else { roleElement.innerHTML = currentRole.substring(0, charIndex + 1); charIndex++; typingSpeed = 80; }

    if (!isDeleting && charIndex === currentRole.length) { isDeleting = true; typingSpeed = 1500; } 
    else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; typingSpeed = 500; }
    setTimeout(typeWriter, typingSpeed);
}