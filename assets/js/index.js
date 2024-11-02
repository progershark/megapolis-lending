function isElementAtBottom(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return rect.bottom >= windowHeight;
}

function isElementAtTop(element) {
    const rect = element.getBoundingClientRect();
    return rect.top === 0;
}


function resetGallery(item) {
    const galleryContainer = item.querySelector('.galleryContainer');
    const galleryImages = galleryContainer.querySelectorAll('img');
    const counter = item.querySelector('.galleryCounter');
    galleryImages.forEach((img, i) => {
        img.classList.remove('active');
    });
    if (galleryImages.length > 0) {
        galleryImages[0].classList.add('active');
    }
    if (counter) {
        counter.textContent = `1 / ${galleryImages.length}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true
    });

    const header = document.querySelector('.c-header');

    // Активный класс на карточку слайдера
    document.querySelectorAll('.c-product__cards').forEach(card => {
        card.addEventListener('click', function(event) {
            const targetItem = event.target.closest('.c-product__cards-item');
            if (targetItem) {
                if (targetItem.classList.contains('active')) {
                    return;
                }
                const items = card.querySelectorAll('.c-product__cards-item');
                items.forEach(item => {
                    if (item === targetItem && !item.classList.contains('active')) {
                        items.forEach(i => {
                            if (i.classList.contains('active')) {
                                resetGallery(i);
                            }
                            i.classList.remove('active')
                        });
                        item.classList.add('active');
                    }
                });
            }
        });
    });



    // Меняем изображения каждые 2 секунды
    function createSlider(selector, interval, transitionDelay) {
        const images = document.querySelectorAll(selector + ' img');
        let currentIndex = 0;
        let isTransitioning = false;

        function showNextImage() {
            if (isTransitioning) return;

            isTransitioning = true;
            images[currentIndex].classList.add('hidden-img');

            if (transitionDelay) {
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % images.length;
                    images[currentIndex].classList.remove('hidden-img');
                    isTransitioning = false;
                }, transitionDelay);
            } else {
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.remove('hidden-img');
                isTransitioning = false;
            }
        }

        setInterval(showNextImage, interval);
    }

    createSlider('.modelsImages', 1500, 100);
    /*createSlider('.modelsImages2', 2000, 0);*/



    // Menu
    document.querySelectorAll('.btnMenuBurger, .contentMenuBurger .c-header__menu-nav ul li a').forEach(btn => {
        btn.addEventListener('click', () => {
            const contentMenuBurger = document.querySelector('.contentMenuBurger');
            updateMenuHeight(contentMenuBurger);

            if (contentMenuBurger.classList.contains('fade-in')) {
                hideModalMenu(contentMenuBurger);
                document.body.style.overflow = 'inherit';
                window.removeEventListener('resize', updateMenuHeight);
                window.removeEventListener('scroll', updateMenuHeight);
            } else {
                showModalMenu(contentMenuBurger);
                document.body.style.overflow = 'hidden';
                window.addEventListener('resize', () => updateMenuHeight(contentMenuBurger));
                window.addEventListener('scroll', () => updateMenuHeight(contentMenuBurger));
            }
        });
    });

    function updateMenuHeight(contentMenuBurger) {
        contentMenuBurger.style.height = `${window.innerHeight}px`;
        console.log(window.innerHeight);
    }

    function hideModalMenu(contentMenuBurger) {
        contentMenuBurger.classList.remove('fade-in');
        contentMenuBurger.classList.add('fade-out');
    }

    function showModalMenu(contentMenuBurger) {
        contentMenuBurger.classList.remove('fade-out');
        contentMenuBurger.classList.add('fade-in');
    }




    // Popup
    const btnTriggerPopup = document.querySelectorAll('.btnTriggerPopup');
    const btnModalClose = document.querySelectorAll('.btnModalCloseFile');
    const formStatusModal = document.querySelector('.c-modal[data-modal="form-status"]');
    const formStatusTitle = formStatusModal.querySelector('#form-status-title');
    const formStatusText = formStatusModal.querySelector('#form-status-text');
    const formStatusButton = formStatusModal.querySelector('#form-status-button');

    let previousModal = null;

    btnTriggerPopup.forEach(btn => {
        if (!btn.getAttribute('data-target')) {
            btn.remove();
        }
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            const modal = document.querySelector(`.c-modal[data-modal="${target}"]`);
            showModal(modal);
        });
    });

    btnModalClose.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.c-modal');
            const iframe = modal.querySelector('iframe');

            hideModal(modal);

            if (iframe) {
                const currentSrc = iframe.src;
                iframe.src = '';
                iframe.src = currentSrc;
            }
        });
    });

    document.addEventListener('wpcf7mailsent', handleModalEvent('success'), false);
    document.addEventListener('wpcf7spam', handleModalEvent('error'), false);
    document.addEventListener('wpcf7mailfailed', handleModalEvent('error'), false);

    function showModal(modal) {
        modal.classList.add('fade-in');
        modal.style.visibility = 'visible';
    }

    function hideModal(modal) {
        modal.classList.remove('fade-in');
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.style.visibility = 'hidden';
            modal.classList.remove('fade-out');
        }, 300);
    }

    function handleModalEvent(type) {
        return function(event) {
            // Если форма находится в модальном окне, скрываем его
            const modal = document.querySelector('.c-modal.fade-in');
            if (modal) {
                previousModal = modal;
                hideModal(modal);
            }

            setTimeout(() => {
                updateFormStatusModal(type);
                showModal(formStatusModal);
            }, 200);
        };
    }

    function updateFormStatusModal(type) {
        if (type === 'success') {
            formStatusTitle.textContent = 'Спасибо за вашу заявку! Ваши данные успешно отправлены.';
            formStatusText.innerHTML = 'Мы свяжемся с вами в ближайшее время, чтобы <br class="mob-hidden"> обсудить все детали.';
            formStatusButton.textContent = 'Закрыть';
        } else if (type === 'error') {
            formStatusTitle.textContent = 'Ошибка при отправке данных';
            formStatusText.innerHTML = 'К сожалению, не удалось отправить ваши данные. Попробуйте отправить данные еще раз. Если проблема повторится, свяжитесь с нами по телефону: <br> +7 995 090 88 22';
            formStatusButton.textContent = 'Попробовать снова';
            formStatusButton.addEventListener('click', () => {
                hideModal(formStatusModal);
                setTimeout(() => {
                    if (previousModal) {
                        showModal(previousModal);
                    } else {
                        // Если форма была на странице, ничего не делаем
                    }
                }, 200);
            }, { once: true });
        }
    }



    // Gallery _
    const galleryItem = document.querySelectorAll('.galleryItem');

    galleryItem.forEach(item => {
        const galleryContainer = item.querySelector('.galleryContainer');
        const galleryImages = galleryContainer.querySelectorAll('img');
        const galleryButtonPrev = item.querySelector('.galleryButtonPrev');
        const galleryButtonNext = item.querySelector('.galleryButtonNext');
        const counter = item.querySelector('.galleryCounter');
        let galleryCurrentIndex = 0;

        function showImage(index) {
            galleryImages.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            galleryCurrentIndex = index;
            updateCounter();
        }

        function updateCounter() {
            counter.textContent = `${galleryCurrentIndex + 1} / ${galleryImages.length}`;
        }

        galleryButtonPrev.addEventListener('click', function() {
            galleryCurrentIndex = (galleryCurrentIndex - 1 + galleryImages.length) % galleryImages.length;
            showImage(galleryCurrentIndex);
        });

        galleryButtonNext.addEventListener('click', function() {
            galleryCurrentIndex = (galleryCurrentIndex + 1) % galleryImages.length;
            showImage(galleryCurrentIndex);
        });

        if (galleryImages.length <= 1) {
            counter.remove();
            galleryButtonPrev.remove();
            galleryButtonNext.remove();
        }

        // Инициализация
        showImage(galleryCurrentIndex);
    });



    // scrollBtnUp
    document.querySelector('.scrollBtnUp').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });



    // Табы
    const tabBlocks = document.querySelectorAll('.tabBlock');
    tabBlocks.forEach(tabBlock => {
        const tabButtons = tabBlock.querySelectorAll('.tabButton');
        const tabPanels = tabBlock.querySelectorAll('section[role="tabpanel"]');
        const tabButtonPrev = tabBlock.querySelector('.tabButtonPrev');
        const tabButtonNext = tabBlock.querySelector('.tabButtonNext');
        const tabWrapList = tabBlock.querySelector('.c-product__tags');
        const tabList = tabBlock.querySelector('.c-product__tags ul');
        const tabListItems = tabList.querySelectorAll('li');

        let currentIndex = 0;

        function updateButtons() {
            if (currentIndex === 0) {
                tabButtonPrev.disabled = true;
            } else {
                tabButtonPrev.disabled = false;
            }

            if (currentIndex === tabButtons.length - 1) {
                tabButtonNext.disabled = true;
            } else {
                tabButtonNext.disabled = false;
            }
        }

        function updateTabs() {
            tabButtons.forEach((button, index) => {
                if (index === currentIndex) {
                    button.setAttribute('aria-selected', 'true');
                    button.classList.add('active');
                } else {
                    button.setAttribute('aria-selected', 'false');
                    button.classList.remove('active');
                }
            });

            tabPanels.forEach((panel, index) => {
                if (index === currentIndex) {
                    panel.style.display = 'block';
                    setTimeout(() => {
                        panel.classList.add('active');
                        panel.classList.remove('hiddenTagContent');
                    }, 0);
                } else {
                    panel.classList.remove('active');
                    panel.classList.add('hiddenTagContent');
                    panel.style.display = 'none';
                }
            });
        }

        function scrollToActiveTab() {
            const activeTab = tabListItems[currentIndex];
            const tabListRect = tabList.getBoundingClientRect();
            const activeTabRect = activeTab.getBoundingClientRect();

            if (activeTabRect.left < tabListRect.left) {
                tabList.scrollLeft += activeTabRect.left - tabListRect.left;
            } else if (activeTabRect.right > tabListRect.right) {
                tabList.scrollLeft += activeTabRect.right - tabListRect.right;
            }
        }

        function scrollTabs(direction) {
            const tabButtonWidth = tabButtons[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(tabList).gap, 10);
            const scrollAmount = tabButtonWidth + gap;

            if (direction === 'next') {
                tabWrapList.scrollLeft += scrollAmount;
            } else if (direction === 'prev') {
                tabWrapList.scrollLeft -= scrollAmount;
            }
        }

        tabButtonPrev.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateTabs();
                updateButtons();
                scrollToActiveTab();
                scrollTabs('prev');
            }
        });

        tabButtonNext.addEventListener('click', function() {
            if (currentIndex < tabButtons.length - 1) {
                currentIndex++;
                updateTabs();
                updateButtons();
                scrollToActiveTab();
                scrollTabs('next');
            }
        });

        tabButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                currentIndex = index;
                updateTabs();
                updateButtons();
                scrollToActiveTab();
            });
        });

        if (tabButtons.length <= 1) {
            tabButtonPrev.remove();
            tabButtonNext.remove();
        }

        updateButtons();
        updateTabs();
    });




    // Banner process top
    const wrapProcess = document.querySelector('.processScrollMain');

    if(wrapProcess) {
        const process = document.querySelector('.processScroll');
        const processItems = process.querySelectorAll('.processScrollItem');
        const processBar = document.querySelector('.processBar span');

        // Рассчитываем отступы и промежуток
        const gapValue = parseFloat(window.getComputedStyle(process).gap);
        const processPaddingL = parseFloat(window.getComputedStyle(process).paddingLeft);
        const processPaddingR = window.innerWidth - (processPaddingL + processItems[0].offsetWidth);
        const processPaddingX = processPaddingL + processPaddingR;

        process.style.paddingRight = `${processPaddingR}px`;

        let horizontalScrollAmount = 0;
        let shouldPreventDefault = true;
        let lastScrollTime = 0;
        const scrollDelay = 800; // Задержка между скроллами
        const scrollStep = processItems[0].offsetWidth + gapValue;

        // Рассчитываем общую ширину контента и максимальный горизонтальный скролл
        const totalWidth = Array.from(processItems)
                .reduce((sum, item) => sum + item.offsetWidth, 0)
            + gapValue * (processItems.length - 1) + processPaddingX;
        const maxHorizontalScroll = totalWidth - wrapProcess.offsetWidth;
        const isScrollable = maxHorizontalScroll > 0;

        function handleScroll(event) {
            if (shouldPreventDefault && isElementAtBottom(wrapProcess)) {
                event.preventDefault();
            }

            const currentTime = performance.now();
            const timeSinceLastScroll = currentTime - lastScrollTime;
            if (timeSinceLastScroll < scrollDelay) return; // Пропускаем, если задержка не прошла

            if (isElementAtBottom(wrapProcess)) {
                if (event.deltaY > 0 && horizontalScrollAmount > -maxHorizontalScroll) {
                    horizontalScrollAmount = Math.max(horizontalScrollAmount - scrollStep, -maxHorizontalScroll);
                    shouldPreventDefault = true;
                } else if (event.deltaY < 0 && horizontalScrollAmount < 0) {
                    horizontalScrollAmount = Math.min(horizontalScrollAmount + scrollStep, 0);
                    shouldPreventDefault = true;
                }

                console.log(window.innerWidth + "Ширина экрана");
                console.log(horizontalScrollAmount + "Ширина шага");
                console.log(maxHorizontalScroll + "Ширина обертки");

                process.style.transform = `translateX(${horizontalScrollAmount}px)`;

                const scrollPercentage = Math.abs(horizontalScrollAmount) / maxHorizontalScroll * 100;
                processBar.style.width = `${scrollPercentage.toFixed(2)}%`;

                lastScrollTime = currentTime;

                if (horizontalScrollAmount <= -maxHorizontalScroll) {
                    setTimeout(function tick() {
                        shouldPreventDefault = false;
                    }, 1000);
                }
            }
        }

        function handleTouchMove(event) {
            const touch = event.touches[0];
            const wrapRect = wrapProcess.getBoundingClientRect();
            if (touch.clientY > wrapRect.top && touch.clientY < wrapRect.bottom) {
                event.preventDefault();
            }
        }

        function autoScroll() {
            if (horizontalScrollAmount > -maxHorizontalScroll) {
                horizontalScrollAmount = Math.max(horizontalScrollAmount - scrollStep, -maxHorizontalScroll);
                process.style.transform = `translateX(${horizontalScrollAmount}px)`;

                const scrollPercentage = Math.abs(horizontalScrollAmount) / maxHorizontalScroll * 100;
                processBar.style.width = `${scrollPercentage.toFixed(2)}%`;
            } else {
                horizontalScrollAmount = 0; // Сброс скролла
                process.style.transform = `translateX(${horizontalScrollAmount}px)`;
                processBar.style.width = '0%';
            }
        }

        function combinedInterval() {
            autoScroll();
            showNextItem();
        }

        if (window.innerWidth > 1024 && isScrollable) {
            wrapProcess.addEventListener('wheel', handleScroll);
            wrapProcess.addEventListener('touchmove', handleTouchMove);
            header.addEventListener('wheel', handleScroll);
            header.addEventListener('touchmove', handleTouchMove);
        } else if (isScrollable) {
            setInterval(combinedInterval, 3000);
        }



        // переключаем каждые 3 секунды блоки внизу баннера
        const items = document.querySelectorAll('.c-banner__info-item');
        let currentIndex = 0;
        let intervalId;

        function showNextItem() {
            items[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % items.length;
            items[currentIndex].classList.add('active');
        }

        function startSlider() {
            items[currentIndex].classList.add('active');
            //intervalId = setInterval(showNextItem, 3000);
        }

        function stopSlider() {
            clearInterval(intervalId);
            items.forEach(item => item.classList.remove('active'));
        }

        function checkScreenSize() {
            if (window.innerWidth < 768) {
                startSlider();
            } else {
                stopSlider();
            }
        }

        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);
    }

    // Cookies
    const cookieBanner = document.querySelector('.cookieBanner');
    const cookieButton = document.querySelector('.cookieBtn');

    // Функция для установки cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Функция для получения cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    if (!getCookie('cookieConsent')) {
        cookieBanner.classList.add('show');
    }

    cookieButton.addEventListener('click', function() {
        setCookie('cookieConsent', 'true', 365);
        cookieBanner.classList.remove('show');
    });



    // Высота для баннеров
    const elementsBannerImg = document.querySelectorAll('.c-banner__img, .banner__gif, .c-banner__img, .banner__gif-video');
    if (elementsBannerImg && window.innerWidth <= 1024) {
        const height = window.innerHeight;
        elementsBannerImg.forEach(element => {
            element.style.height = height + 'px';
        });
    }


    // Определяем Ос
    if (navigator.userAgent.indexOf("Win") != -1) {
        document.body.classList.add('windows');
    } else if (navigator.userAgent.indexOf("Mac") != -1) {
        document.body.classList.add('mac');
    }
});