// ========================================
// Variables Globales
// ========================================
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
let autoplayInterval;

// Detectar tipo de dispositivo
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Ajustar comportamiento según dispositivo
if (isMobile || isTouch) {
    document.body.classList.add('touch-device');
}

// ========================================
// Navegación Mobile
// ========================================
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

// ========================================
// Carrusel de Coaching
// ========================================
function showSlide(index) {
    // Validar índice
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Ocultar todos los slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Desactivar todos los indicadores
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });

    // Mostrar slide actual
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }

    // Activar indicador actual
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Event Listeners para botones del carrusel
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
}

// Event Listeners para indicadores
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
        resetAutoplay();
    });
});

// Autoplay del carrusel
function startAutoplay() {
    autoplayInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Cambia cada 5 segundos
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
}

function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

// Iniciar autoplay cuando se carga la página
if (slides.length > 0) {
    showSlide(0);
    startAutoplay();
}

// Pausar autoplay cuando el usuario interactúa
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);
}

// Soporte para gestos táctiles en el carrusel
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50; // Píxeles mínimos para considerar un swipe
    const verticalThreshold = 100; // Evitar conflicto con scroll vertical
    
    const horizontalDistance = Math.abs(touchEndX - touchStartX);
    const verticalDistance = Math.abs(touchEndY - touchStartY);
    
    // Solo procesar si el swipe es más horizontal que vertical
    if (horizontalDistance > verticalThreshold && horizontalDistance > verticalDistance) {
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe hacia la izquierda - siguiente slide
            nextSlide();
            resetAutoplay();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe hacia la derecha - slide anterior
            prevSlide();
            resetAutoplay();
        }
    }
}

// ========================================
// Smooth Scroll con offset para header fijo
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Animaciones al hacer scroll
// ========================================
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.servicio-card, .programa-card, .equipo-card');
    
    animatedElements.forEach((element, index) => {
        if (isElementInViewport(element) && !element.classList.contains('animate-on-scroll')) {
            setTimeout(() => {
                element.classList.add('animate-on-scroll');
            }, index * 100); // Efecto de cascada
        }
    });
}

// Ejecutar animaciones en scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        handleScrollAnimations();
    });
});

// Ejecutar animaciones en carga inicial
window.addEventListener('load', handleScrollAnimations);

// ========================================
// Header con efecto al hacer scroll
// ========================================
const header = document.querySelector('.header');
let lastScroll = 0;

// En móviles, header siempre visible por usabilidad
const shouldHideHeader = !isMobile && window.innerWidth > 768;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (shouldHideHeader) {
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll hacia abajo - ocultar header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll hacia arriba - mostrar header
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }
    } else {
        // En móviles siempre mostrar
        header.style.transform = 'translateY(0)';
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// Formulario de Contacto
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            servicio: document.getElementById('servicio').value,
            mensaje: document.getElementById('mensaje').value
        };
        
        // Validación básica
        if (!formData.nombre || !formData.email || !formData.servicio || !formData.mensaje) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('Por favor, ingresa un correo electrónico válido', 'error');
            return;
        }
        
        // Deshabilitar botón mientras se envía
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        // Enviar email usando EmailJS
        emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', {
            from_name: formData.nombre,
            from_email: formData.email,
            servicio: formData.servicio,
            message: formData.mensaje,
            to_email: 'Alvacon2003@hotmail.com'
        })
        .then(() => {
            showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
            contactForm.reset();
        })
        .catch((error) => {
            console.error('Error al enviar:', error);
            showNotification('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo o contáctanos directamente.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    });
}

// ========================================
// Sistema de Notificaciones
// ========================================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Agregar animaciones de notificaciones al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .header {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);

// ========================================
// Contador de caracteres para textarea
// ========================================
const mensajeTextarea = document.getElementById('mensaje');
if (mensajeTextarea) {
    const maxLength = 500;
    
    const counterDiv = document.createElement('div');
    counterDiv.style.cssText = `
        text-align: right;
        font-size: 0.875rem;
        color: #9ca3af;
        margin-top: 0.25rem;
    `;
    mensajeTextarea.parentElement.appendChild(counterDiv);
    
    function updateCounter() {
        const currentLength = mensajeTextarea.value.length;
        counterDiv.textContent = `${currentLength}/${maxLength} caracteres`;
        
        if (currentLength > maxLength * 0.9) {
            counterDiv.style.color = '#ef4444';
        } else {
            counterDiv.style.color = '#9ca3af';
        }
    }
    
    mensajeTextarea.addEventListener('input', updateCounter);
    mensajeTextarea.setAttribute('maxlength', maxLength);
    updateCounter();
}

// ========================================
// Lazy Loading para imágenes (cuando se agreguen)
// ========================================
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Ejecutar lazy loading si hay imágenes
if ('IntersectionObserver' in window) {
    lazyLoadImages();
}

// ========================================
// Control de teclado para el carrusel
// ========================================
document.addEventListener('keydown', (e) => {
    // Solo si el carrusel está visible
    const carouselSection = document.querySelector('.coaching');
    if (!carouselSection) return;
    
    const rect = carouselSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isVisible) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    }
});

// ========================================
// Efecto parallax sutil en hero
// ========================================
const hero = document.querySelector('.hero');
const heroDecorations = document.querySelector('.hero-decorations');

if (hero && heroDecorations) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxSpeed = 0.5;
            heroDecorations.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// ========================================
// Inicialización
// ========================================
console.log('%c Alvas Consultores ', 'background: #1e3a52; color: #f4b942; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('Página web desarrollada para Alvas Consultores - Esto es lo que hacemos por tu empresa.');

// Mensaje de bienvenida después de que todo cargue
window.addEventListener('load', () => {
    console.log('✓ Todos los recursos han sido cargados correctamente');
    console.log('✓ Carrusel inicializado');
    console.log('✓ Navegación mobile configurada');
    console.log('✓ Formulario de contacto listo');
    console.log('✓ Modo:', isMobile ? 'Móvil' : 'Escritorio');
    console.log('✓ Touch:', isTouch ? 'Habilitado' : 'Deshabilitado');
});

// ========================================
// Optimizaciones para móviles
// ========================================

// Prevenir zoom al hacer doble tap en iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Mejorar rendimiento de scroll en móviles
let ticking = false;
function optimizedScroll(callback) {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            callback();
            ticking = false;
        });
        ticking = true;
    }
}

// Detectar orientación del dispositivo
function handleOrientationChange() {
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    document.body.setAttribute('data-orientation', orientation);
    
    // Ajustar hero en landscape
    if (orientation === 'landscape' && window.innerHeight < 600) {
        document.querySelector('.hero')?.style.setProperty('min-height', 'auto');
    } else {
        document.querySelector('.hero')?.style.removeProperty('min-height');
    }
}

window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);
handleOrientationChange();

// Mejorar experiencia de notificaciones en móviles
const originalShowNotification = showNotification;
showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Ajustar posición en móviles
    const isMobileView = window.innerWidth <= 768;
    
    notification.style.cssText = `
        position: fixed;
        top: ${isMobileView ? '80px' : '100px'};
        ${isMobileView ? 'left: 10px; right: 10px;' : 'right: 20px; max-width: 350px;'}
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: ${isMobileView ? '0.875rem 1rem' : '1rem 1.5rem'};
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
        font-size: ${isMobileView ? '0.9rem' : '1rem'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
};