(function () {
  const cards = document.querySelectorAll('[data-domaine-product-card]');

  cards.forEach((card) => {
    const primaryImage = card.querySelector('[data-domaine-primary-image]');
    const secondaryImage = card.querySelector('[data-domaine-secondary-image]');
    const saleBadge = card.querySelector('[data-domaine-sale-badge]');
    const price = card.querySelector('[data-domaine-price]');
    const comparePrice = card.querySelector('[data-domaine-compare-price]');
    const swatches = card.querySelectorAll('[data-domaine-swatch]');

    const setText = (node, value) => {
      if (!node) return;
      node.textContent = value || '';
    };

    const setImage = (image, src, srcset, alt) => {
      if (!image || !src) return;
      image.src = src;
      image.srcset = srcset || '';
      if (alt) image.alt = alt;
    };

    const updateCard = (swatch) => {
      const isOnSale = swatch.dataset.onSale === 'true';

      swatches.forEach((button) => {
        const isActive = button === swatch;
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        button.classList.toggle('ring-2', isActive);
        button.classList.toggle('ring-[#0a4874]', isActive);
        button.classList.toggle('ring-offset-2', isActive);
      });

      setImage(primaryImage, swatch.dataset.primarySrc, swatch.dataset.primarySrcset, swatch.dataset.primaryAlt || swatch.dataset.imageAlt);
      setImage(secondaryImage, swatch.dataset.secondarySrc, swatch.dataset.secondarySrcset, swatch.dataset.secondaryAlt || swatch.dataset.imageAlt);
      setText(price, swatch.dataset.price);
      setText(comparePrice, swatch.dataset.comparePrice);

      if (price) {
        price.classList.toggle('text-[#ff0000]', isOnSale);
        price.classList.toggle('text-[#111111]', !isOnSale);
      }
      if (saleBadge) saleBadge.hidden = !isOnSale;
      if (comparePrice) comparePrice.hidden = !isOnSale;
    };

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => updateCard(swatch));
    });
  });
})();
