function isElementAtBottom(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return rect.bottom >= windowHeight;
}

function isElementAtTop(element) {
    const rect = element.getBoundingClientRect();
    return rect.top === 0;
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
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
                        items.forEach(i => i.classList.remove('active'));
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

    createSlider('.modelsImages', 1000, 100);
    createSlider('.modelsImages2', 2000, 0);



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
            hideModal(modal);
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
            formStatusText.innerHTML = 'Мы свяжемся с вами в ближайшее время, чтобы <br> обсудить все детали. Если у вас возникли <br> вопросы, вы <br> всегда можете обратиться к нам.';
            formStatusButton.textContent = 'Закрыть';
        } else if (type === 'error') {
            formStatusTitle.textContent = 'Ошибка при отправке данных';
            formStatusText.innerHTML = 'К сожалению, не удалось отправить ваши данные. <br> Попробуйте отправить данные еще раз. <br> Если проблема <br> повторится, свяжитесь с нами по телефону <br> +7 800 511 41 54';
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
    const process = document.querySelector('.processScroll');
    const processStyle = window.getComputedStyle(process);
    const processPaddingX = parseFloat(processStyle.paddingLeft) + parseFloat(processStyle.paddingRight);
    const processItems = process.querySelectorAll('.processScrollItem');
    const processBar = document.querySelector('.processBar span');

    const gapValue = parseFloat(window.getComputedStyle(process).gap);
    let horizontalScrollAmount = 0;

    const itemCount = processItems.length;
    let totalWidth = Array.from(processItems).reduce((sum, item) => sum + item.offsetWidth, 0);

    totalWidth += gapValue * (itemCount - 1) + processPaddingX;

    //process.style.width = `${totalWidth}px`;

    const horizontalScroll = totalWidth - window.innerWidth;

    let scrollDisabled = false;

    let lastScrollTime = 0;
    let scrollAccumulator = 0;

    function handleScroll(event) {
        if(isElementAtBottom(wrapProcess)) {
            const currentTime = performance.now();
            const timeDelta = currentTime - lastScrollTime;
            lastScrollTime = currentTime;

            const scrollSpeed = Math.abs(event.deltaY) / timeDelta;
            const scrollAmount = Math.min(scrollSpeed * 50, 50);

            if (event.deltaY > 0 && horizontalScrollAmount > (horizontalScroll * -1)) {
                scrollAccumulator += scrollAmount;
                horizontalScrollAmount -= scrollAmount;
                scrollDisabled = true;
            } else if (event.deltaY < 0 && horizontalScrollAmount < 0) {
                scrollAccumulator += scrollAmount;
                horizontalScrollAmount += scrollAmount;
                scrollDisabled = true;
            } else {
                scrollDisabled = false;
            }

            if (horizontalScrollAmount > 0) {
                horizontalScrollAmount = 0;
            }

            if (horizontalScrollAmount < (horizontalScroll * -1)) {
                horizontalScrollAmount = horizontalScroll * -1;
            }

            process.style.transform = `translateX(${horizontalScrollAmount}px)`;

            if (scrollDisabled) {
                event.preventDefault();
            }

            // для полосы бара
            const positiveScrollAmount = Math.abs(horizontalScrollAmount);
            const percentage = (positiveScrollAmount / horizontalScroll) * 100;

            processBar.style.width = `${percentage.toFixed(2)}%`;
        }
    }

    if (totalWidth <= wrapProcess.offsetWidth) {
        return;
    }

    wrapProcess.addEventListener('wheel', handleScroll);
    wrapProcess.addEventListener('touchmove', handleScroll);
    header.addEventListener('wheel', handleScroll);
    header.addEventListener('touchmove', handleScroll);

    // Определяем Ос
    if (navigator.userAgent.indexOf("Win") != -1) {
        document.body.classList.add('windows');
    } else if (navigator.userAgent.indexOf("Mac") != -1) {
        document.body.classList.add('mac');
    }
});