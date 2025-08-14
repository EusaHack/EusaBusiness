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
                // Calcular offset para el header fijo
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Scroll suave a la sección
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar enlace activo
                updateActiveNavLink(this);
                
                // Cerrar menú móvil si está abierto
                closeMobileMenu();
            }
        });
    });
    
    // Detectar sección activa durante el scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Actualizar enlace activo basado en la sección visible
        if (current) {
            const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
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