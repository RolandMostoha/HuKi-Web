/**
 * Handles language detection and translations for the sites.
 */

function initializeLanguage() {
    const isEnglishPath = window.location.pathname.includes('/en/');
    const storedLang = localStorage.getItem('lang');

    // 1. First-time visit: check browser language and redirect if necessary.
    if (!storedLang && !isEnglishPath && navigator.language.startsWith('en')) {
        console.info('Browser is English, redirecting to /en/');
        window.location.href = 'en/';
        return; // Stop further execution until redirect happens
    }

    // 2. Determine the language to display.
    // The URL path is the most reliable source of truth.
    let lang;
    if (isEnglishPath) {
        lang = 'en';
    } else {
        lang = 'hu';
    }

    setLanguage(lang);
}

async function setLanguage(lang) {
    try {
        const isEnglishPage = window.location.pathname.includes('/en/');
        const pathPrefix = isEnglishPage ? '../' : '';
        const res = await fetch(`${pathPrefix}lang/${lang}.json`);
        const translations = await res.json();

        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) el.textContent = translations[key];
        });

        document.querySelectorAll('[data-i18n-src]').forEach(el => {
            const key = el.getAttribute('data-i18n-src');
            if (translations[key]) el.src = translations[key];
        });

        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            const key = el.getAttribute('data-i18n-alt');
            if (translations[key]) el.alt = translations[key];
        });

        document.querySelectorAll('[data-i18n-content]').forEach(el => {
            const key = el.getAttribute('data-i18n-content');
            if (translations[key]) el.content = translations[key];
        });

        localStorage.setItem('lang', lang);
    } catch (err) {
        console.error('Error loading language:', err);
    }
}

initializeLanguage();