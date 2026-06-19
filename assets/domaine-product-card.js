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

  function getCssVariable(element, name, fallback) {
    const value = window.getComputedStyle(element).getPropertyValue(name).trim();
    return value || fallback;
  }

  function updateSwatchState(swatches, activeSwatch, activeColor) {
    swatches.forEach((swatch) => {
      const isActive = swatch === activeSwatch;
      const swatchRing = swatch.querySelector('[data-domaine-swatch-ring]');

      swatch.setAttribute('aria-pressed', isActive ? 'true' : 'false');

      if (swatchRing) {
        swatchRing.style.borderColor = isActive ? activeColor : 'transparent';
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
    const variantSelect = card.querySelector('[data-domaine-variant-select]');
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

    function updatePriceState(isOnSale, nextPrice, nextComparePrice) {
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
    }

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

      updatePriceState(isOnSale, nextPrice, nextComparePrice);
      updateSwatchState(swatches, swatch, getCssVariable(card, '--domaine-card-active-color', '#0a4874'));
      updateVariantOptionState(variantOptions, nextVariantId, nextColorValue);
    }

    function selectVariantOption(option) {
      if (!option) return;

      const primarySrc = option.dataset.primarySrc || '';
      const primarySrcset = option.dataset.primarySrcset || '';
      const isOnSale = option.dataset.onSale === 'true';
      const nextPrice = option.dataset.price || '';
      const nextComparePrice = option.dataset.comparePrice || '';
      const nextVariantId = option.value || '';

      setImage(primaryImage, primarySrc, primarySrcset, option.dataset.primaryAlt || '');
      setImage(secondaryImage, '', '', '');
      card.dataset.hasSecondary = 'false';
      setImageView('primary');
      updatePriceState(isOnSale, nextPrice, nextComparePrice);
      updateVariantOptionState(variantOptions, nextVariantId, '');
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

        if (matchingSwatch) {
          selectSwatch(matchingSwatch, option.dataset.variantId || '');
          return;
        }

        if (variantSelect) {
          variantSelect.value = option.dataset.variantId || '';
          selectVariantOption(variantSelect.selectedOptions[0]);
        }
      });
    });

    if (variantSelect) {
      variantSelect.addEventListener('change', () => {
        selectVariantOption(variantSelect.selectedOptions[0]);
      });
    }
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function initDomaineCatalog(catalog) {
    const pageSize = Number(catalog.dataset.pageSize) || 4;
    const items = [...catalog.querySelectorAll('[data-domaine-catalog-item]')];
    const searchInput = catalog.querySelector('[data-domaine-catalog-search]');
    const filters = [...catalog.querySelectorAll('[data-domaine-catalog-filter]')];
    const resetButton = catalog.querySelector('[data-domaine-catalog-reset]');
    const count = catalog.querySelector('[data-domaine-catalog-count]');
    const empty = catalog.querySelector('[data-domaine-catalog-empty]');
    const pagination = catalog.querySelector('[data-domaine-catalog-pagination]');
    const prevButton = catalog.querySelector('[data-domaine-catalog-prev]');
    const nextButton = catalog.querySelector('[data-domaine-catalog-next]');
    const pages = catalog.querySelector('[data-domaine-catalog-pages]');
    let currentPage = 1;

    function getFilterValue(name) {
      const filter = filters.find((item) => item.dataset.domaineCatalogFilter === name);
      return filter ? filter.value : 'all';
    }

    function getMatches() {
      const query = normalize(searchInput ? searchInput.value : '');
      const availability = getFilterValue('availability');
      const variantSetup = getFilterValue('variantSetup');
      const vendor = getFilterValue('vendor');
      const type = getFilterValue('type');

      return items.filter((item) => {
        const searchableText = [
          item.dataset.title,
          item.dataset.vendor,
          item.dataset.type,
          item.dataset.tags
        ].join(' ');

        if (query && !normalize(searchableText).includes(query)) return false;
        if (availability !== 'all' && item.dataset.availability !== availability) return false;
        if (variantSetup !== 'all' && item.dataset.variantSetup !== variantSetup) return false;
        if (vendor !== 'all' && item.dataset.vendor !== vendor) return false;
        if (type !== 'all' && item.dataset.type !== type) return false;

        return true;
      });
    }

    function renderPageButtons(totalPages) {
      if (!pages) return;

      pages.innerHTML = '';

      for (let page = 1; page <= totalPages; page += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = page.toString();
        button.dataset.page = page.toString();
        button.className = page === currentPage
            ? 'inline-flex h-[38px] min-w-[38px] items-center justify-center rounded-full border border-[#0a4874] bg-[#0a4874] px-3 text-sm font-medium leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4874] focus-visible:ring-offset-2'
            : 'inline-flex h-[38px] min-w-[38px] items-center justify-center rounded-full border border-zinc-300 bg-white px-3 text-sm font-medium leading-none text-[#111111] transition hover:border-[#0a4874] hover:text-[#0a4874] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4874] focus-visible:ring-offset-2';
        button.setAttribute('aria-label', `Go to products page ${page}`);
        button.setAttribute('aria-current', page === currentPage ? 'page' : 'false');
        pages.append(button);
      }
    }

    function render() {
      const matches = getMatches();
      const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));

      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      items.forEach((item) => {
        item.hidden = true;
      });

      matches.slice(start, end).forEach((item) => {
        item.hidden = false;
      });

      if (count) {
        count.textContent = `${matches.length} ${matches.length === 1 ? 'product' : 'products'}`;
      }

      if (empty) {
        empty.hidden = matches.length > 0;
        empty.classList.toggle('hidden', matches.length > 0);
      }

      if (pagination) {
        pagination.hidden = matches.length <= pageSize;
        pagination.classList.toggle('hidden', matches.length <= pageSize);
      }

      if (prevButton) {
        prevButton.disabled = currentPage <= 1;
      }

      if (nextButton) {
        nextButton.disabled = currentPage >= totalPages;
      }

      renderPageButtons(totalPages);
    }

    function reset() {
      if (searchInput) {
        searchInput.value = '';
      }

      filters.forEach((filter) => {
        filter.value = 'all';
      });

      currentPage = 1;
      render();
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        currentPage = 1;
        render();
      });
    }

    filters.forEach((filter) => {
      filter.addEventListener('change', () => {
        currentPage = 1;
        render();
      });
    });

    if (resetButton) {
      resetButton.addEventListener('click', reset);
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentPage = Math.max(1, currentPage - 1);
        render();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(getMatches().length / pageSize));
        currentPage = Math.min(totalPages, currentPage + 1);
        render();
      });
    }

    if (pages) {
      pages.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-page]');
        if (!button) return;

        currentPage = Number(button.dataset.page) || 1;
        render();
      });
    }

    render();
  }

  function initAllCards() {
    document
        .querySelectorAll('[data-domaine-product-card]')
        .forEach((card) => {
          try {
            initDomaineProductCard(card);
          } catch (error) {
            console.error('Failed to initialize Domaine product card', error);
          }
        });
  }

  function initAllCatalogs() {
    document
        .querySelectorAll('[data-domaine-catalog]')
        .forEach(initDomaineCatalog);
  }

  function initAll() {
    initAllCards();
    initAllCatalogs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
