/**
 * KAIZEN SUSHI • NIKKEI CRAFT & DELIVERY HOUSE
 * Interactive Menu Logic & WhatsApp Order Integration
 * Developed for Breborn.cl Showcase
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initOrderForm();
  initProductAddButtons();
  initMobileMenu();
});

// Número de demostración comercial enlazado a Breborn
const WHATSAPP_PHONE = '56956823670';

/**
 * Navegación por pestañas de la carta
 */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}

/**
 * Conexión de botones "Pedir Promo" y "Agregar" de los rolls con el formulario
 */
function initProductAddButtons() {
  const promoBtns = document.querySelectorAll('.btn-select-product');
  const rollCards = document.querySelectorAll('.roll-card');
  const promoSelect = document.getElementById('fPromo');
  const extraSelect = document.getElementById('fExtra');
  const orderSection = document.getElementById('pedido');
  const orderBox = document.querySelector('.order-box');

  const scrollToOrderWithGlow = () => {
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });

      if (orderBox) {
        orderBox.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
        orderBox.style.borderColor = '#ff4d4f';
        orderBox.style.boxShadow = '0 0 45px rgba(255, 77, 79, 0.75)';
        setTimeout(() => {
          orderBox.style.boxShadow = '';
          orderBox.style.borderColor = '';
        }, 1800);
      }
    }
  };

  // Botones de las tablas destacadas
  promoBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetProduct = btn.getAttribute('data-target-product');
      if (promoSelect && targetProduct) {
        selectOptionOrAdd(promoSelect, targetProduct);
      }
      scrollToOrderWithGlow();
    });
  });

  // Tarjetas de rolls y entradas
  rollCards.forEach((card) => {
    const addBtn = card.querySelector('.btn-add-roll');
    const rollName = card.getAttribute('data-roll-name');

    const handleSelect = (e) => {
      e.stopPropagation();
      if (!rollName) return;

      const parentTab = card.closest('.tab-content');
      const tabId = parentTab ? parentTab.id : '';

      if (tabId === 'tab-entradas' && extraSelect) {
        selectOptionOrAdd(extraSelect, rollName);
      } else if (promoSelect) {
        selectOptionOrAdd(promoSelect, rollName);
      }

      scrollToOrderWithGlow();
    };

    if (addBtn) {
      addBtn.addEventListener('click', handleSelect);
    }
    card.addEventListener('click', (e) => {
      if (e.target !== addBtn) {
        handleSelect(e);
      }
    });
  });
}

/**
 * Selecciona una opción en el <select> o la agrega dinámicamente si no existe
 */
function selectOptionOrAdd(selectElem, text) {
  let matched = false;
  for (let i = 0; i < selectElem.options.length; i++) {
    const optVal = selectElem.options[i].value;
    if (optVal.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(optVal.toLowerCase())) {
      selectElem.selectedIndex = i;
      matched = true;
      break;
    }
  }
  if (!matched) {
    const newOpt = new Option(text, text, true, true);
    selectElem.add(newOpt);
  }
}

/**
 * Procesamiento y generación de pedido a WhatsApp
 */
function initOrderForm() {
  const form = document.getElementById('sushiOrderForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const mode = document.getElementById('fMode')?.value || 'Delivery';
      const location = document.getElementById('fLocation')?.value || 'Viña del Mar';
      const promo = document.getElementById('fPromo')?.value || 'Tabla Kaizen';
      const extra = document.getElementById('fExtra')?.value || 'Sin extra';
      const sauces = document.getElementById('fSauces')?.value || 'Soya y Teriyaki';
      const beverage = document.getElementById('fBeverage')?.value || 'Sin bebida';
      const address = document.getElementById('fAddress')?.value || '';

      const lines = [
        '¡Hola Kaizen Sushi! 🍣 Quiero hacer un pedido:',
        '',
        `🛵 *Modalidad:* ${mode}`,
        `📍 *Sucursal de Despacho:* ${location}`,
        `🍱 *Tabla / Roll Principal:* ${promo}`
      ];

      if (!extra.includes('Sin entrada') && !extra.includes('Ninguna')) {
        lines.push(`🥟 *Entrada / Acompañamiento:* ${extra}`);
      }

      lines.push(`🥢 *Salsas de Preferencia:* ${sauces}`);

      if (!beverage.includes('Sin bebida')) {
        lines.push(`🥤 *Bebida / Cerveza:* ${beverage}`);
      }

      lines.push(`🏠 *Dirección / Cliente:* ${address}`);
      lines.push('');
      lines.push('¿Me confirman tiempo de entrega estimado y datos para transferir? ¡Muchas gracias!');

      const fullMessage = lines.join('\n');
      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(fullMessage)}`;

      window.open(waUrl, '_blank');
    });
  }
}

/**
 * Menú móvil responsive
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.m-link');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
      });
    });
  }
}
