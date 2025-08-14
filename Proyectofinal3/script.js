document.addEventListener('DOMContentLoaded', () => {

    // --- Manejo del Menú Desplegable ---
    const menuButton = document.getElementById('menuButton');
    const closeMenuButton = document.getElementById('closeMenuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    const body = document.body;

    menuButton.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        menuButton.classList.add('active'); // Add active class to button for animation
        body.classList.add('no-scroll');
    });

    closeMenuButton.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        menuButton.classList.remove('active'); // Remove active class from button
        body.classList.remove('no-scroll');
    });

    // --- Control de Visibilidad de Secciones y Navegación ---
    const allPageSections = document.querySelectorAll('.page-section');
    const menuLinks = document.querySelectorAll('.overlay-nav .menu-link');

    // Función para mostrar una sección específica y ocultar las demás
    const showSection = (targetId) => {
        allPageSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });
        // Scroll to the top of the displayed section
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // Al cargar la página, muestra la sección de Novedades por defecto
    showSection('novedades-section');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor link behavior
            const targetId = link.getAttribute('data-target');
            
            showSection(targetId); // Llama a la nueva función para mostrar/ocultar
            closeMenuButton.click(); // Close the menu after clicking a link
        });
    });


    // --- Manejo de Modales (Filtros, Info, y Detalle de Producto) ---
    const filterModal = document.getElementById('filterModal');
    const infoModal = document.getElementById('infoModal');
    const productDetailModal = document.getElementById('productDetailModal');

    const openModal = (modal) => {
        modal.classList.add('active');
        body.classList.add('no-scroll');
    };
    
    const closeModal = (modal) => {
        modal.classList.remove('active');
        body.classList.remove('no-scroll');
    };

    // Event listeners para los botones de FILTRAR e INFO de cada sección
    // Estos botones ahora abrirán los modales de filtro e info genéricos
    document.querySelectorAll('[id^="filterButton"]').forEach(button => {
        button.addEventListener('click', () => openModal(filterModal));
    });
    document.querySelectorAll('[id^="infoIcon"]').forEach(button => {
        button.addEventListener('click', () => openModal(infoModal));
    });


    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-id');
            if (modalId) {
                closeModal(document.getElementById(modalId));
            } else {
                // Fallback for close buttons without data-modal-id, assumes they are inside a modal
                if (button.closest('#infoModal')) closeModal(infoModal);
                if (button.closest('#productDetailModal')) closeModal(productDetailModal);
                if (button.closest('#filterModal')) closeModal(filterModal);
            }
        });
    });
    
    const closeInfoModalBtn = document.getElementById('closeInfoModalBtn');
    if (closeInfoModalBtn) {
        closeInfoModalBtn.addEventListener('click', () => closeModal(infoModal));
    }

    // Cierra el modal si se hace clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // --- Cambio de Layout del Grid (Ahora para cada grid por ID) ---
    document.querySelectorAll('.layout-button').forEach(button => {
        button.addEventListener('click', () => {
            const targetGridId = button.getAttribute('data-target-grid');
            const productGrid = document.getElementById(targetGridId);

            // Asegura que solo los botones de layout de la MISMA barra superior se desactiven
            // Se selecciona el padre común para buscar los botones de layout
            button.closest('.view-options').querySelectorAll('.layout-button').forEach(btn => btn.classList.remove('active'));
            // Añade la clase activa al botón presionado
            button.classList.add('active');

            const cols = button.getAttribute('data-cols');
            // Elimina clases cols-X existentes y añade la nueva
            productGrid.classList.remove('cols-3', 'cols-4', 'cols-5'); // Ajusta si tienes más/menos cols
            productGrid.classList.add(`cols-${cols}`);
        });
    });


    // --- Filtro de Categorías (Ahora para cada sección) ---
    document.querySelectorAll('.category-nav').forEach(categoryNav => {
        const categoryLinks = categoryNav.querySelectorAll('a');
        // Encuentra el product-grid asociado a esta category-nav
        const productGrid = categoryNav.closest('.page-section').querySelector('.product-grid');
        const productItems = productGrid.querySelectorAll('.product-item');

        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Activa el link de categoría dentro de SU category-nav
                categoryLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                const selectedCategory = link.getAttribute('data-category');

                productItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (selectedCategory.startsWith('all-') || selectedCategory === itemCategory) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    });

    // --- Product Detail Modal Logic ---
    const detailProductImage = document.getElementById('detailProductImage');
    const detailProductName = document.getElementById('detailProductName');
    const detailProductPrice = document.getElementById('detailProductPrice');
    const detailProductDescription = document.getElementById('detailProductDescription');
    const detailColorSwatches = document.getElementById('detailColorSwatches');
    const selectedColorName = document.getElementById('selectedColorName');

    document.querySelectorAll('.product-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgElement = item.querySelector('img');
            
            const fullSrc = imgElement.getAttribute('data-full-src');
            const name = imgElement.getAttribute('data-name');
            const price = imgElement.getAttribute('data-price');
            const description = imgElement.getAttribute('data-description');
            const colorsJson = imgElement.getAttribute('data-colors');
            
            // Populate modal content
            detailProductImage.src = fullSrc;
            detailProductImage.alt = name;
            detailProductName.textContent = name;
            detailProductPrice.textContent = `Q ${parseFloat(price).toFixed(2)}`;
            detailProductDescription.textContent = description;

            // Clear previous swatches
            detailColorSwatches.innerHTML = '';
            selectedColorName.textContent = ''; // Clear color name initially

            if (colorsJson) {
                try {
                    const colors = JSON.parse(colorsJson);
                    if (colors.length > 0) {
                        // Set the first color as selected by default for display
                        selectedColorName.textContent = getColorName(colors[0]); // Use getColorName for the initial display
                        
                        colors.forEach(color => {
                            const swatch = document.createElement('div');
                            swatch.classList.add('color-swatch');
                            swatch.style.backgroundColor = color;
                            swatch.setAttribute('data-color-hex', color);

                            const colorNameDisplay = getColorName(color); // Get a friendly name
                            swatch.setAttribute('title', `Color: ${colorNameDisplay}`);

                            swatch.addEventListener('click', () => {
                                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected-swatch'));
                                swatch.classList.add('selected-swatch');
                                selectedColorName.textContent = getColorName(swatch.getAttribute('data-color-hex'));
                            });
                            detailColorSwatches.appendChild(swatch);
                        });
                        // Select the first swatch by default after they are all added
                        // Asegúrate de que existe un .color-swatch antes de intentar seleccionarlo
                        const firstSwatch = detailColorSwatches.querySelector('.color-swatch');
                        if (firstSwatch) {
                            firstSwatch.classList.add('selected-swatch');
                        }
                    }
                } catch (e) {
                    console.error("Error parsing colors JSON:", e);
                }
            }


            openModal(productDetailModal);
        });
    });

    // Helper function to get a friendly color name from hex
    function getColorName(hex) {
        // You can expand this mapping for more colors
        const colorMap = {
            '#000000': 'NEGRO',
            '#FFFFFF': 'BLANCO',
            '#7A7A7A': 'GRIS ANTRACITA',
            '#ADD8E6': 'AZUL CLARO',
            '#00008B': 'AZUL OSCURO',
            '#A9A9A9': 'GRIS', /* Asegúrate de que el hex esté en mayúsculas si tu HTML lo genera así */
            '#556B2F': 'VERDE OLIVA',
            '#B0C4DE': 'AZUL ACERO',
            '#8B4513': 'MARRÓN SEPIA',
            '#C0C0C0': 'PLATA',
            '#008000': 'VERDE',
            '#F5DEB3': 'TRIGO',
            '#4682B4': 'AZUL ACERO',
            '#2F4F4F': 'GRIS PIZARRA',
            '#F08080': 'CORAL',
            '#FFD700': 'ORO',
            '#DCDCDC': 'BLANCO ROTO',
            '#9ACD32': 'VERDE LIMA',
            '#BC8F8F': 'ROSA VIEJO'
        };
        // Convertir el hex de entrada a mayúsculas para la búsqueda en el mapa
        return colorMap[hex.toUpperCase()] || hex.substring(1).toUpperCase(); // Default to hex if not found
    }


    // --- Accordion for Product Details ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionContent = header.nextElementSibling; // Get the content div
            
            // Toggle the active class on the header and content
            header.classList.toggle('active');
            accordionContent.classList.toggle('active');

            if (accordionContent.classList.contains('active')) {
                // When opening, set max-height to scrollHeight to allow smooth transition
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            } else {
                // When closing, set max-height to 0
                accordionContent.style.maxHeight = "0";
            }
        });
    });

});