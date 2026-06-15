(() => {
  function setImage(image, src, srcset, alt) {
    if (!image) return;

    if (!src) {
      image.hidden = true;
      image.removeAttribute('src');
      image.removeAttribute('srcset');
      return;
    }

    image.hidden = false;
    image.src = src;

    if (srcset) {
      image.srcset = srcset;
    } else {
      image.removeAttribute('srcset');
    }

    if (alt) {
      image.alt = alt;
    }
  }

  function toggleHidden(element, shouldHide) {
    if (!element) return;
    element.hidden = shouldHide;
  }

  function updateSwatchState(swatches, activeSwatch) {
    swatches.forEach((swatch) => {
      const isActive = swatch === activeSwatch;
      const swatchRing = swatch.querySelector('[data-domaine-swatch-ring]');

      swatch.setAttribute('aria-pressed', isActive ? 'true' : 'false');

      if (swatchRing) {
        swatchRing.style.borderColor = isActive ? '#0a4874' : 'transparent';
      }
    });
  }

  function updateVariantOptionState(variantOptions, activeVariantId, activeColorValue) {
    variantOptions.forEach((option) => {
      const isActive = activeVariantId
          ? option.dataset.variantId === activeVariantId
          : !!activeColorValue && option.dataset.colorValue === activeColorValue;

      option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function initDomaineProductCard(card) {
    const primaryImage = card.querySelector('[data-domaine-primary-image]');
    const secondaryImage = card.querySelector('[data-domaine-secondary-image]');
    const mediaToggle = card.querySelector('[data-domaine-media-toggle]');
    const saleBadge = card.querySelector('[data-domaine-sale-badge]');
    const price = card.querySelector('[data-domaine-price]');
    const comparePrice = card.querySelector('[data-domaine-compare-price]');
    const swatches = [...card.querySelectorAll('[data-domaine-swatch]')];
    const productContext = card.parentElement || card;
    const variantOptions = [...productContext.querySelectorAll('[data-domaine-variant-option]')];

    function setImageView(view) {
      const hasSecondary = card.dataset.hasSecondary === 'true';
      const nextView = hasSecondary && view === 'secondary' ? 'secondary' : 'primary';

      card.dataset.imageView = nextView;

      if (mediaToggle) {
        mediaToggle.disabled = !hasSecondary;
        mediaToggle.setAttribute('aria-pressed', nextView === 'secondary' ? 'true' : 'false');
        mediaToggle.setAttribute(
            'aria-label',
            nextView === 'secondary' ? 'Show primary product image' : 'Show alternate product image'
        );
      }
    }

    if (mediaToggle) {
      mediaToggle.addEventListener('click', () => {
        if (mediaToggle.disabled) return;

        setImageView(card.dataset.imageView === 'secondary' ? 'primary' : 'secondary');
      });
    }

    setImageView('primary');

    function selectSwatch(swatch, activeVariantIdOverride) {
      if (!swatch) return;

      const primarySrc = swatch.dataset.primarySrc || '';
      const primarySrcset = swatch.dataset.primarySrcset || '';
      const secondarySrc = swatch.dataset.secondarySrc || '';
      const secondarySrcset = swatch.dataset.secondarySrcset || '';
      const isOnSale = swatch.dataset.onSale === 'true';
      const nextPrice = swatch.dataset.price || '';
      const nextComparePrice = swatch.dataset.comparePrice || '';
      const nextVariantId = activeVariantIdOverride || swatch.dataset.variantId || '';
      const nextColorValue = swatch.dataset.colorValue || '';

      setImage(
          primaryImage,
          primarySrc,
          primarySrcset,
          swatch.dataset.primaryAlt || swatch.dataset.imageAlt || ''
      );

      setImage(
          secondaryImage,
          secondarySrc,
          secondarySrcset,
          swatch.dataset.secondaryAlt || swatch.dataset.imageAlt || ''
      );

      card.dataset.hasSecondary = secondarySrc ? 'true' : 'false';
      setImageView('primary');

      if (price && nextPrice) {
        price.textContent = nextPrice;
        price.classList.toggle('text-[#ff0000]', isOnSale);
        price.classList.toggle('text-[#111111]', !isOnSale);
      }

      if (comparePrice) {
        comparePrice.textContent = nextComparePrice;
        toggleHidden(comparePrice, !isOnSale || !nextComparePrice);
      }

      toggleHidden(saleBadge, !isOnSale);
      updateSwatchState(swatches, swatch);
      updateVariantOptionState(variantOptions, nextVariantId, nextColorValue);
    }

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        selectSwatch(swatch);
      });
    });

    variantOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const matchingSwatch =
            swatches.find((swatch) => swatch.dataset.variantId === option.dataset.variantId) ||
            swatches.find((swatch) => swatch.dataset.colorValue === option.dataset.colorValue);

        selectSwatch(matchingSwatch, option.dataset.variantId || '');
      });
    });
  }

  function initAllCards() {
    document
        .querySelectorAll('[data-domaine-product-card]')
        .forEach(initDomaineProductCard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCards);
  } else {
    initAllCards();
  }
})();
