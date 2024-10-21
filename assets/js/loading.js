document.addEventListener('DOMContentLoaded', () => {
    // Создаем элемент загрузочного экрана
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';

    // Создаем элемент спиннера
    const spinner = document.createElement('div');
    spinner.className = 'spinner';

    document.body.style.overflow = 'hidden';

    // Добавляем спиннер в загрузочный экран
    loadingScreen.appendChild(spinner);

    // Добавляем загрузочный экран в body
    document.body.appendChild(loadingScreen);

    // Скрываем основной контент
    /*const content = document.getElementById('content');
    content.style.display = 'none';*/

    // Показываем загрузочный экран
    loadingScreen.style.display = 'flex';

    // Скрываем загрузочный экран и показываем основной контент после загрузки страницы
    window.addEventListener('load', () => {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = 'inherit';
        /*content.style.display = 'block';*/

        // AOS
        AOS.init({
            once: true
        });
    });
});