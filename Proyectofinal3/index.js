// Variables globales para el carrusel
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const slideContainer = document.getElementById('slideContainer');
const dots = document.querySelectorAll('.dot'); // Selección de los puntos indicadores
const totalSlides = slides.length;
let autoSlideInterval;

// Función para mostrar la diapositiva actual y actualizar los puntos indicadores
function showSlide(index) {
    slideContainer.style.transform = `translateX(-${index * 100}%)`;

    // Actualiza la clase 'active' para los puntos indicadores
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active'); // Agrega la clase 'active' al punto correspondiente
        } else {
            dot.classList.remove('active'); // Remueve la clase 'active' de los otros puntos
        }
    });
}

// Función para avanzar a la siguiente diapositiva
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
    resetAutoSlide(); // Reinicia el temporizador de auto-avance
}

// Función para retroceder a la diapositiva anterior
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
    resetAutoSlide(); // Reinicia el temporizador de auto-avance
}

// Función para navegar a una diapositiva específica (usada por los puntos indicadores)
function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
    resetAutoSlide(); // Reinicia el temporizador de auto-avance
}

// Función para iniciar el avance automático del carrusel
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); // Cambia cada 4 segundos
}

// Función para reiniciar el temporizador de avance automático
// Se llama cada vez que el usuario interactúa manualmente con el carrusel
function resetAutoSlide() {
    clearInterval(autoSlideInterval); // Detiene el temporizador actual
    startAutoSlide(); // Inicia un nuevo temporizador
}

// Event Listeners para los puntos indicadores
// Cada punto, al ser clicado, navegará a la diapositiva correspondiente
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        goToSlide(index);
    });
});

// Asignar las funciones a la ventana global para que puedan ser llamadas desde los atributos 'onclick' en el HTML
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide; // Asegúrate de que goToSlide también esté disponible globalmente

// Inicialización del carrusel cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide); // Muestra la diapositiva inicial (la primera) y activa su punto
    startAutoSlide(); // Inicia el avance automático del carrusel
});
