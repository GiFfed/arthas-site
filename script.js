/* ==========================================================================
   1. ИНИЦИАЛИЗА DOM-ЭЛЕМЕНТОВ И ГЛОБАЛЬНОГО СОСТОЯНИЯ
   ========================================================================== */
const body = document.body;
const themeBtn = document.getElementById('theme-toggle-btn');
const mainTitle = document.getElementById('main-title');
const subtitle = document.querySelector('.hero-section .subtitle');
const blizzardOverlay = document.getElementById('blizzard-overlay');

const corruptionBar = document.getElementById('corruption-bar');
const corruptionText = document.getElementById('corruption-text');
const milestones = document.querySelectorAll('.milestone-trigger');

const heroSection = document.querySelector('.hero-section');
const nameInput = document.getElementById('user-name') || document.querySelector('.form-section input[type="text"]');
const webForm = document.getElementById('feedback-form');

const quotes = {
    light: "«За Лордерон! За моего отца — Короля!»",
    dark: "«Я получил власть которая и не снилась моему отцу...»"
};

let typewriterTimeout = null;
let isTransitioning = false;
let activeEasterEggKey = null;
let isEasterEggSequenceActive = false;
let hasActiveEasterEggQuote = false;

/* ==========================================================================
   2. 3D TILT ЭФФЕКТ КАРТОЧЕК
   ========================================================================== */
function init3DTilt() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        let rafId = null;

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.08s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
        });

        card.addEventListener('mousemove', (e) => {
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -3.5;
                const rotateY = ((x - centerX) / centerX) * 3.5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}
init3DTilt();

/* ==========================================================================
   3. ВЫЛЕТАЮЩИЙ ТЕКСТ (FLOATING TEXT)
   ========================================================================== */
function spawnFloatingText(text, x, y, isDark = true) {
    const el = document.createElement('div');
    el.className = `floating-text ${isDark ? 'dark' : 'light'}`;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 1200);
}

/* ==========================================================================
   4. ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ И HOLY MOTES
   ========================================================================== */
function typeEffect(element, text, speed = 35, onComplete = null) {
    if (!element) return;
    clearTimeout(typewriterTimeout);
    element.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            typewriterTimeout = setTimeout(type, speed);
        } else if (typeof onComplete === 'function') {
            onComplete();
        }
    }
    type();
}

function createHolyMotes() {
    const container = document.getElementById('holy-motes');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const mote = document.createElement('div');
        mote.className = 'holy-mote';
        mote.style.left = `${Math.random() * 100}%`;
        mote.style.animationDuration = `${Math.random() * 4 + 4}s`;
        mote.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(mote);
    }
}
createHolyMotes();

if (!body.classList.contains('theme-light') && !body.classList.contains('theme-dark')) {
    body.classList.add('theme-light');
}
typeEffect(subtitle, quotes.light);

/* ==========================================================================
   5. ПАСХАЛКИ C АВТОСКРОЛЛОМ
   ========================================================================== */
const loreEasterEggs = {
    'джайна': {
        quote: '«Артас, ты ли это? Пожалуйста, покажи мне, что Свет еще не угас в тебе...»',
        cssClass: 'subtitle-jaina',
        toast: ' Джайна Праудмур чувствует твое присутствие...'
    },
    'jaina': {
        quote: '«Артас, ты ли это? Пожалуйста, покажи мне, что Свет еще не угас в тебе...»',
        cssClass: 'subtitle-jaina',
        toast: ' Джайна Праудмур чувствует твое присутствие...'
    },
    'утер': {
        quote: '«Мальчик мой, ты еще не переступил черту. Вернись к Святому Свету!»',
        cssClass: 'subtitle-uther',
        toast: ' Утер Светоносный молится за твою душу!'
    },
    'uther': {
        quote: '«Мальчик мой, ты еще не переступил черту. Вернись к Святому Свету!»',
        cssClass: 'subtitle-uther',
        toast: ' Утер Светоносный молится за твою душу!'
    },
    'мал\'ганис': {
        quote: '«Твой разум принадлежит Плети, принц. Встретимся во льдах Нордскола!»',
        cssClass: 'subtitle-malganis',
        toast: ' Шепот Повелителя Ужаса раздается в твоих ушах...'
    },
    'малганис': {
        quote: '«Твой разум принадлежит Плети, принц. Встретимся во льдах Нордскола!»',
        cssClass: 'subtitle-malganis',
        toast: ' Шепот Повелителя Ужаса раздается в твоих ушах...'
    },
    'mal\'ganis': {
        quote: '«Твой разум принадлежит Плети, принц. Встретимся во льдах Нордскола!»',
        cssClass: 'subtitle-malganis',
        toast: ' Шепот Повелителя Ужаса раздается в твоих ушах...'
    },
    'malganis': {
        quote: '«Твой разум принадлежит Плети, принц. Встретимся во льдах Нордскола!»',
        cssClass: 'subtitle-malganis',
        toast: ' Шепот Повелителя Ужаса раздается в твоих ушах...'
    },
    'артас': {
        quote: '«Я заплачу любую цену, лишь бы спасти свой народ!»',
        cssClass: '',
        toast: ' Имя истинного Наследника Лордерона произнесено!'
    },
    'arthas': {
        quote: '«Я заплачу любую цену, лишь бы спасти свой народ!»',
        cssClass: '',
        toast: ' Имя истинного Наследника Лордерона произнесено!'
    },
    'иллидан': {
        quote: '«Вы не готовы!»',
        cssClass: 'subtitle-malganis',
        toast: ' Ты чувствуешь жгучее дыхание Скверны...'
    },
    'illidan': {
        quote: '«Вы не готовы!»',
        cssClass: 'subtitle-malganis',
        toast: ' Ты чувствуешь жгучее дыхание Скверны...'
    },
    'кел\'тузад': {
        quote: '«Моя жизнь принадлежит Королю-личу...»',
        cssClass: '',
        toast: ' Некромант преклоняет колени перед тобой...'
    },
    'kel\'thuzad': {
        quote: '«Моя жизнь принадлежит Королю-личу...»',
        cssClass: '',
        toast: ' Некромант преклоняет колени перед тобой...'
    }
};

if (nameInput) {
    nameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toLowerCase();

        if (loreEasterEggs[val]) {
            if (activeEasterEggKey === val || isEasterEggSequenceActive) return;

            activeEasterEggKey = val;
            isEasterEggSequenceActive = true;
            hasActiveEasterEggQuote = true;

            subtitle.classList.remove('subtitle-jaina', 'subtitle-uther', 'subtitle-malganis');
            const egg = loreEasterEggs[val];

            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                if (egg.cssClass) subtitle.classList.add(egg.cssClass);
                showWarcraftToast(egg.toast);

                typeEffect(subtitle, egg.quote, 35, () => {
                    setTimeout(() => {
                        if (nameInput) {
                            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        setTimeout(() => {
                            isEasterEggSequenceActive = false;
                        }, 800);
                    }, 1400);
                });
            }, 400);

        } else {
            activeEasterEggKey = null;

            if (hasActiveEasterEggQuote && !isEasterEggSequenceActive) {
                hasActiveEasterEggQuote = false;
                subtitle.classList.remove('subtitle-jaina', 'subtitle-uther', 'subtitle-malganis');
                const defaultQuote = body.classList.contains('theme-dark') ? quotes.dark : quotes.light;
                typeEffect(subtitle, defaultQuote);
            }
        }
    });
}

/* ==========================================================================
   6. ПЕРЕКЛЮЧЕНИЕ ТЕМ И ФАЗ
   ========================================================================== */
function triggerThemeSwitch(targetToDark) {
    if (isTransitioning) return;
    isTransitioning = true;
    if (themeBtn) themeBtn.style.pointerEvents = 'none';

    if (targetToDark) {
        blizzardOverlay.classList.remove('to-light-active');
        blizzardOverlay.classList.add('to-dark-active');
    } else {
        blizzardOverlay.classList.remove('to-dark-active');
        blizzardOverlay.classList.add('to-light-active');
    }

    setTimeout(() => {
        if (targetToDark) {
            body.classList.remove('theme-light');
            body.classList.add('theme-dark', 'dark-phase');
            if (themeBtn) themeBtn.textContent = 'Вернуть свет Лордерона ☀️';
            if (mainTitle) mainTitle.textContent = 'Король-лич Артас Менетил';
            if (!hasActiveEasterEggQuote) typeEffect(subtitle, quotes.dark);
            createSnow();
            if (corruptionBar) corruptionBar.style.width = "100%";
            if (corruptionText) corruptionText.textContent = "Тьма поглотила тебя";
            milestones.forEach(cb => cb.checked = true);
        } else {
            body.classList.remove('theme-dark', 'dark-phase');
            body.classList.add('theme-light');
            if (themeBtn) themeBtn.textContent = 'Присягнуть Тьме ❄️';
            if (mainTitle) mainTitle.textContent = 'Принц Артас Менетил';
            if (!hasActiveEasterEggQuote) typeEffect(subtitle, quotes.light);
            resetMilestones();
            removeSnow();
            createHolyMotes();
        }
    }, targetToDark ? 1600 : 400);

    setTimeout(() => {
        blizzardOverlay.classList.remove('to-dark-active', 'to-light-active');
        if (themeBtn) themeBtn.style.pointerEvents = 'auto';
        isTransitioning = false;
    }, targetToDark ? 3500 : 1600);
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const isLightingUp = body.classList.contains('theme-dark');
        triggerThemeSwitch(!isLightingUp);
    });
}

/* ==========================================================================
   7. СНЕГОПАД И ИНТЕРАКТИВНЫЕ МИЛСТОУНЫ
   ========================================================================== */
function createSnow() {
    if (document.querySelector('.snow-container')) return;
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    document.body.appendChild(snowContainer);

    const snowShapes = ['❄', '❅', '❆'];
    for (let i = 0; i < 35; i++) {
        const flake = document.createElement('span');
        flake.className = 'snowflake';
        flake.textContent = snowShapes[Math.floor(Math.random() * snowShapes.length)];
        flake.style.fontSize = `${Math.random() * 8 + 10}px`;
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random() * 4}s`;
        flake.style.animationDuration = `${Math.random() * 4 + 4}s`;
        snowContainer.appendChild(flake);
    }
}

function removeSnow() {
    const snowContainer = document.querySelector('.snow-container');
    if (snowContainer) snowContainer.remove();
}

milestones.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top;

        if (e.target.checked) {
            spawnFloatingText('Нордскол шепчет твоё имя...', x, y, true);
        } else {
            spawnFloatingText('Шёпот Фростморна утихает...', x, y, false);
        }
        updateCorruption();
    });
});

function updateCorruption() {
    if (isTransitioning) return;
    let currentScore = 0;
    milestones.forEach(cb => {
        if (cb.checked) currentScore += parseInt(cb.dataset.weight || 0, 10);
    });

    if (corruptionBar) corruptionBar.style.width = `${currentScore}%`;

    if (currentScore === 0) {
        if (corruptionText) corruptionText.textContent = "Человечность: 100%";
        if (body.classList.contains('theme-dark')) setTimeout(() => triggerThemeSwitch(false), 1000);
    } else if (currentScore < 100) {
        if (corruptionText) corruptionText.textContent = `Падение души: ${currentScore}%`;
    } else {
        if (corruptionText) corruptionText.textContent = "Тьма поглотила тебя...";
        if (!body.classList.contains('theme-dark')) setTimeout(() => triggerThemeSwitch(true), 600);
    }
}

function resetMilestones() {
    milestones.forEach(cb => cb.checked = false);
    if (corruptionBar) corruptionBar.style.width = "0%";
    if (corruptionText) corruptionText.textContent = "Человечность: 100%";
}

/* ==========================================================================
   8. ИНТЕРАКТИВНЫЕ РУНЫ
   ========================================================================== */
const runeCards = document.querySelectorAll('.rune-card');
runeCards.forEach(card => {
    card.addEventListener('click', () => {
        runeCards.forEach(r => r.classList.remove('rune-active'));
        card.classList.add('rune-active');

        const title = card.querySelector('.rune-title').textContent;
        showWarcraftToast(`Вызван древний резонанс: ${title}`);
    });
});

/* ==========================================================================
   9. ПАРАЛЛАКС, SECTION REVEAL И ФОРМА
   ========================================================================== */
const revealSections = document.querySelectorAll('.biography-section, .goals-section, .table-section, .form-section, .runes-section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('section-visible');
    });
}, { threshold: 0.15 });

revealSections.forEach(section => {
    section.classList.add('section-hidden');
    revealObserver.observe(section);
});

if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        heroSection.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        heroSection.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
}

function showWarcraftToast(message) {
    const oldToast = document.querySelector('.warcraft-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'warcraft-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('toast-visible');
    });

    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

if (webForm) {
    webForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentName = (nameInput && nameInput.value.trim() !== "") ? nameInput.value.trim() : "Незнакомец";
        if (body.classList.contains('theme-dark')) {
            showWarcraftToast(`«Твоя воля услышана, ${currentName}... Ледяная Скорбь поглотит твою душу!»`);
        } else {
            showWarcraftToast(`«Спасибо за ваш ответ, ${currentName}. Да пребудет с вами Свет Лордерона!»`);
        }
    });
}