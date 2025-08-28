// Script principal para EusaSpark
// Maneja la interactividad de la página web

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initNavigation();
    initMobileMenu();
    initScrollEffects();
    initContactForm();
    initAnimations();
});

// Navegación y scroll suave
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Manejar clicks en enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calcular offset para el header fijo con margen adicional
                const headerHeight = document.querySelector('.header').offsetHeight;
                const additionalOffset = 20; // Margen adicional para mejor alineación
                const targetPosition = targetSection.offsetTop - headerHeight - additionalOffset;
                
                // Scroll suave a la sección
                window.scrollTo({
                    top: Math.max(0, targetPosition), // Evitar valores negativos
                    behavior: 'smooth'
                });
                
                // Actualizar enlace activo
                updateActiveNavLink(this);
                
                // Cerrar menú móvil si está abierto
                closeMobileMenu();
            }
        });
    });
    
    // Detectar sección activa durante el scroll con debounce
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Usar debounce para mejorar performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveSection();
        }, 10);
    });
    
    // Función separada para actualizar sección activa
    function updateActiveSection() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPosition = window.pageYOffset;
        const additionalOffset = 20; // Mismo offset que en el click
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - additionalOffset;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Mejorar la detección de sección activa
            if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionBottom - 50) {
                current = section.getAttribute('id');
            }
        });
        
        // Manejar caso especial para la primera sección
        if (scrollPosition < 100) {
            current = 'inicio';
        }
        
        // Actualizar enlace activo basado en la sección visible
        if (current) {
            const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
            if (activeLink && !activeLink.classList.contains('active')) {
                updateActiveNavLink(activeLink);
            }
        }
    }
}

// Actualizar enlace de navegación activo
function updateActiveNavLink(activeLink) {
    // Remover clase active de todos los enlaces
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase active al enlace actual
    activeLink.classList.add('active');
}

// Menú móvil
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // Cerrar menú al hacer click fuera de él
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

// Alternar menú móvil
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (!nav || !mobileMenuBtn) return;
    
    const isOpen = nav.classList.contains('mobile-open');
    
    if (isOpen) {
        // Cerrar menú
        closeMobileMenu();
    } else {
        // Abrir menú
        nav.classList.add('mobile-open');
        mobileMenuBtn.classList.add('active');
        
        // Agregar estilos CSS dinámicos para el menú móvil
        nav.style.display = 'block';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'white';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        nav.style.borderRadius = '0 0 12px 12px';
        nav.style.padding = '1rem';
        nav.style.zIndex = '999';
        
        // Estilos para la lista de navegación móvil
        const navList = nav.querySelector('.nav-list');
        if (navList) {
            navList.style.flexDirection = 'column';
            navList.style.gap = '1rem';
        }
    }
}

// Cerrar menú móvil
function closeMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (!nav || !mobileMenuBtn) return;
    
    nav.classList.remove('mobile-open');
    mobileMenuBtn.classList.remove('active');
    
    // Restaurar estilos originales
    if (window.innerWidth <= 768) {
        // En móvil, ocultar el menú
        nav.style.display = 'none';
    } else {
        // En desktop, restaurar estilos normales
        nav.style.display = '';
    }
    
    nav.style.position = '';
    nav.style.top = '';
    nav.style.left = '';
    nav.style.right = '';
    nav.style.background = '';
    nav.style.boxShadow = '';
    nav.style.borderRadius = '';
    nav.style.padding = '';
    
    const navList = nav.querySelector('.nav-list');
    if (navList) {
        navList.style.flexDirection = '';
        navList.style.gap = '';
    }
}

// Efectos de scroll
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        // Efecto de header al hacer scroll
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
    });
}

// Formulario de contacto
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                service: formData.get('service'),
                message: formData.get('message')
            };
            
            // Validar formulario
            if (validateContactForm(data)) {
                // Simular envío del formulario
                submitContactForm(data);
            }
        });
    }
}

// Validar formulario de contacto
function validateContactForm(data) {
    const errors = [];
    
    // Validar nombre
    if (!data.name || data.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    // Validar servicio
    if (!data.service) {
        errors.push('Por favor selecciona un servicio');
    }
    
    // Validar mensaje
    if (!data.message || data.message.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    // Mostrar errores si los hay
    if (errors.length > 0) {
        showFormMessage(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Simular envío del formulario
function submitContactForm(data) {
    const submitBtn = document.querySelector('.contact-form .btn-primary');
    const originalText = submitBtn.textContent;
    
    // Mostrar estado de carga
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simular delay de envío
    setTimeout(() => {
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Mostrar mensaje de éxito
        showFormMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
        
        // Limpiar formulario
        document.getElementById('contactForm').reset();
        
        // Log de datos (en un caso real, aquí se enviarían al servidor)
        console.log('Datos del formulario:', data);
    }, 2000);
}

// Mostrar mensajes del formulario
function showFormMessage(message, type) {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Estilos del mensaje
    messageDiv.style.padding = '1rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.marginBottom = '1rem';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'success') {
        messageDiv.style.background = '#dcfce7';
        messageDiv.style.color = '#166534';
        messageDiv.style.border = '1px solid #bbf7d0';
    } else {
        messageDiv.style.background = '#fef2f2';
        messageDiv.style.color = '#dc2626';
        messageDiv.style.border = '1px solid #fecaca';
    }
    
    // Insertar mensaje al inicio del formulario
    const form = document.getElementById('contactForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Animaciones de entrada
function initAnimations() {
    // Configurar Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll(
        '.service-card, .project-card, .team-member, .contact-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Funciones utilitarias

// Debounce para optimizar eventos de scroll
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

// Manejar redimensionamiento de ventana
window.addEventListener('resize', debounce(function() {
    // Cerrar menú móvil si se cambia a desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}, 250));

// Prevenir comportamiento por defecto en enlaces vacíos
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
});

// Mejorar accesibilidad con teclado
document.addEventListener('keydown', function(e) {
    // Cerrar menú móvil con Escape
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Navegación con Enter en elementos focusables
    if (e.key === 'Enter' && e.target.classList.contains('nav-link')) {
        e.target.click();
    }
});

// Lazy loading para imágenes SVG (si se agregan imágenes reales en el futuro)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
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

// Función para mostrar/ocultar elementos basado en scroll
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Función para manejar el estado de carga de la página
window.addEventListener('load', function() {
    // Remover cualquier indicador de carga
    document.body.classList.remove('loading');
    
    // Inicializar funcionalidades adicionales después de la carga completa
    initLazyLoading();
    initScrollReveal();
});

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    // En un entorno de producción, aquí se podría enviar el error a un servicio de logging
});

// Exportar funciones para uso externo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initMobileMenu,
        initContactForm,
        validateContactForm
    };
}

// Simulador de VS Code con animaciones de escritura
class VSCodeSimulator {
    constructor() {
        this.currentLanguage = 0;
        this.languages = ['python', 'javascript', 'linux'];
        this.isTyping = false;
        this.typeSpeed = 30; // milisegundos entre caracteres
        
        // Contenido de código para cada lenguaje
        this.codeContent = {
            python: {
                tab: 'main.py',
                code: `<span class="python-comment"># Sistema de gestión de inventario</span>\n<span class="python-keyword">import</span> pandas <span class="python-keyword">as</span> pd\n<span class="python-keyword">from</span> datetime <span class="python-keyword">import</span> datetime\n\n<span class="python-keyword">class</span> <span class="python-function">InventoryManager</span>:\n    <span class="python-keyword">def</span> <span class="python-function">__init__</span>(<span class="python-keyword">self</span>):\n        <span class="python-keyword">self</span>.products = []\n        <span class="python-keyword">self</span>.sales = []\n    \n    <span class="python-keyword">def</span> <span class="python-function">add_product</span>(<span class="python-keyword">self</span>, name, price, stock):\n        product = {\n            <span class="python-string">'name'</span>: name,\n            <span class="python-string">'price'</span>: price,\n            <span class="python-string">'stock'</span>: stock,\n            <span class="python-string">'created_at'</span>: datetime.now()\n        }\n        <span class="python-keyword">self</span>.products.append(product)\n        <span class="python-keyword">return</span> <span class="python-string">f"Producto {name} agregado exitosamente"</span>\n\n<span class="python-comment"># Crear instancia del gestor</span>\nmanager = InventoryManager()\nresult = manager.add_product(<span class="python-string">"Laptop"</span>, <span class="python-number">1299.99</span>, <span class="python-number">50</span>)\n<span class="python-function">print</span>(result)`
            },
            javascript: {
                tab: 'app.js',
                code: `<span class="js-comment">// Sistema de autenticación con JWT</span>\n<span class="js-keyword">const</span> express = <span class="js-function">require</span>(<span class="js-string">'express'</span>);\n<span class="js-keyword">const</span> jwt = <span class="js-function">require</span>(<span class="js-string">'jsonwebtoken'</span>);\n<span class="js-keyword">const</span> bcrypt = <span class="js-function">require</span>(<span class="js-string">'bcrypt'</span>);\n\n<span class="js-keyword">const</span> app = <span class="js-function">express</span>();\napp.<span class="js-property">use</span>(express.<span class="js-function">json</span>());\n\n<span class="js-comment">// Middleware de autenticación</span>\n<span class="js-keyword">const</span> <span class="js-function">authenticateToken</span> = (req, res, next) => {\n    <span class="js-keyword">const</span> authHeader = req.<span class="js-property">headers</span>[<span class="js-string">'authorization'</span>];\n    <span class="js-keyword">const</span> token = authHeader && authHeader.<span class="js-function">split</span>(<span class="js-string">' '</span>)[<span class="js-number">1</span>];\n    \n    <span class="js-keyword">if</span> (!token) {\n        <span class="js-keyword">return</span> res.<span class="js-function">sendStatus</span>(<span class="js-number">401</span>);\n    }\n    \n    jwt.<span class="js-function">verify</span>(token, process.<span class="js-property">env</span>.<span class="js-property">JWT_SECRET</span>, (err, user) => {\n        <span class="js-keyword">if</span> (err) <span class="js-keyword">return</span> res.<span class="js-function">sendStatus</span>(<span class="js-number">403</span>);\n        req.<span class="js-property">user</span> = user;\n        <span class="js-function">next</span>();\n    });\n};\n\n<span class="js-comment">// Ruta de login</span>\napp.<span class="js-function">post</span>(<span class="js-string">'/api/login'</span>, <span class="js-keyword">async</span> (req, res) => {\n    <span class="js-keyword">const</span> { username, password } = req.<span class="js-property">body</span>;\n    <span class="js-comment">// Lógica de autenticación aquí</span>\n});\n\napp.<span class="js-function">listen</span>(<span class="js-number">3000</span>, () => {\n    console.<span class="js-function">log</span>(<span class="js-string">'Servidor ejecutándose en puerto 3000'</span>);\n});`
            },
            linux: {
                tab: 'terminal',
                code: `<span class="linux-prompt">edgar@eusaspark:~$</span> <span class="linux-command">ls</span> <span class="linux-flag">-la</span>\n<span class="linux-output">total 48</span>\n<span class="linux-output">drwxr-xr-x  7 edgar edgar 4096 Jan 15 10:30 .</span>\n<span class="linux-output">drwxr-xr-x  3 root  root  4096 Jan 10 09:15 ..</span>\n<span class="linux-output">-rw-r--r--  1 edgar edgar  220 Jan 10 09:15 .bash_logout</span>\n<span class="linux-output">-rw-r--r--  1 edgar edgar 3526 Jan 10 09:15 .bashrc</span>\n<span class="linux-output">drwxr-xr-x  3 edgar edgar 4096 Jan 12 14:20 projects</span>\n\n<span class="linux-prompt">edgar@eusaspark:~$</span> <span class="linux-command">cd</span> <span class="linux-path">projects/eusabusiness</span>\n\n<span class="linux-prompt">edgar@eusaspark:~/projects/eusabusiness$</span> <span class="linux-command">git</span> <span class="linux-flag">status</span>\n<span class="linux-output">On branch main</span>\n<span class="linux-output">Your branch is up to date with 'origin/main'.</span>\n<span class="linux-output">Changes not staged for commit:</span>\n<span class="linux-output">  modified:   src/components/Dashboard.js</span>\n<span class="linux-output">  modified:   src/styles/main.css</span>\n\n<span class="linux-prompt">edgar@eusaspark:~/projects/eusabusiness$</span> <span class="linux-command">npm</span> <span class="linux-flag">run</span> build\n<span class="linux-output">Building for production...</span>\n<span class="linux-output">✓ Build completed successfully</span>\n<span class="linux-output">✓ Assets optimized</span>\n<span class="linux-output">✓ Bundle size: 2.3MB</span>\n\n<span class="linux-prompt">edgar@eusaspark:~/projects/eusabusiness$</span> <span class="linux-command">docker</span> <span class="linux-flag">build</span> <span class="linux-flag">-t</span> eusabusiness <span class="linux-path">.</span>\n<span class="linux-output">Sending build context to Docker daemon...</span>\n<span class="linux-output">Step 1/8 : FROM node:16-alpine</span>\n<span class="linux-output">Successfully built and tagged eusabusiness:latest</span>\n\n<span class="linux-prompt">edgar@eusaspark:~/projects/eusabusiness$</span> <span class="linux-command">kubectl</span> <span class="linux-flag">apply</span> <span class="linux-flag">-f</span> <span class="linux-path">deployment.yaml</span>\n<span class="linux-output">deployment.apps/eusabusiness created</span>\n<span class="linux-output">service/eusabusiness-service created</span>`
            }
        };
    }
    
    init() {
        this.startAnimation();
    }
    
    async startAnimation() {
        while (true) {
            const currentLang = this.languages[this.currentLanguage];
            const content = this.codeContent[currentLang];
            
            // Actualizar pestaña
            document.getElementById('currentTab').textContent = content.tab;
            
            // Limpiar contenido anterior
            document.getElementById('codeContent').innerHTML = '';
            
            // Animar escritura del código
            await this.typeCode(content.code);
            
            // Esperar 10 segundos
            await this.sleep(8000);
            
            // Cambiar al siguiente lenguaje
            this.currentLanguage = (this.currentLanguage + 1) % this.languages.length;
        }
    }
    
    async typeCode(code) {
        const codeElement = document.getElementById('codeContent');
        const lines = code.split('\\n');
        const lineNumbersElement = document.getElementById('lineNumbers');
        
        // Actualizar números de línea
        lineNumbersElement.innerHTML = lines.map((_, i) => i + 1).join('\\n');
        
        this.isTyping = true;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineElement = document.createElement('div');
            codeElement.appendChild(lineElement);
            
            // Simular escritura carácter por carácter
            await this.typeLine(lineElement, line);
            
            // Pequeña pausa entre líneas
            await this.sleep(100);
        }
        
        this.isTyping = false;
    }
    
    async typeLine(element, text) {
        // Para HTML con etiquetas, necesitamos un enfoque especial
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        let currentIndex = 0;
        const htmlChars = text.split('');
        let insideTag = false;
        let currentHtml = '';
        
        for (let i = 0; i < htmlChars.length; i++) {
            const char = htmlChars[i];
            
            if (char === '<') {
                insideTag = true;
            }
            
            currentHtml += char;
            
            if (char === '>') {
                insideTag = false;
            }
            
            // Solo hacer pausa si no estamos dentro de una etiqueta HTML
            if (!insideTag && char !== '<' && char !== '>') {
                element.innerHTML = currentHtml;
                await this.sleep(this.typeSpeed);
            } else {
                element.innerHTML = currentHtml;
            }
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Modificar la función DOMContentLoaded existente para incluir el simulador
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades existentes
    initNavigation();
    initMobileMenu();
    initScrollEffects();
    initContactForm();
    initAnimations();
    
    // Inicializar simulador VS Code
    const vscodeContainer = document.getElementById('vscodeContainer');
    if (vscodeContainer) {
        const simulator = new VSCodeSimulator();
        simulator.init();
    }
});