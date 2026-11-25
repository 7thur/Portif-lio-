// ================= GALERIA DOS PROJETOS =================
(() => {
    const SLIDER_CONFIG = {
        intervalMs: 3500,
        gradient: "linear-gradient(to right, rgb(0, 157, 255), rgb(255, 0, 255))"
    };

    const updateCardVisuals = (card) => {
        const radios = Array.from(card.querySelectorAll("input[type='radio']"));
        const imgs = Array.from(card.querySelectorAll(".slide-img"));
        const dots = Array.from(card.querySelectorAll(".slider-dots label"));

        const activeIndex = Math.max(
            0,
            radios.findIndex((radio) => radio.checked)
        );

        imgs.forEach((img, index) => {
            img.style.display = index === activeIndex ? "block" : "none";
        });

        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.style.background = isActive ? SLIDER_CONFIG.gradient : "#bbbbbb";
            dot.style.transform = isActive ? "scale(1.25)" : "scale(1)";
        });
    };

    const initAutoTransition = () => {
        const timers = new WeakMap();

        document.querySelectorAll(".project-card").forEach((card) => {
            const radios = Array.from(card.querySelectorAll("input[type='radio']"));
            if (radios.length <= 1) return;

            updateCardVisuals(card);

            const advanceSlide = () => {
                if (card.dataset.paused === "true") return;
                const currentIndex = radios.findIndex((r) => r.checked);
                const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % radios.length : 0;
                radios[nextIndex].checked = true;
                updateCardVisuals(card);
            };

            const intervalId = setInterval(advanceSlide, SLIDER_CONFIG.intervalMs);
            timers.set(card, intervalId);

            radios.forEach((radio) => {
                radio.addEventListener("change", () => updateCardVisuals(card));
            });
        });
    };

    document.addEventListener("DOMContentLoaded", initAutoTransition);
})();

(() => {
    const initPauseControls = () => {
        document.querySelectorAll(".project-card").forEach((card) => {
            const state = {
                isHovering: false,
                lockedByDot: false
            };

            const syncPauseDataset = () => {
                card.dataset.paused = state.isHovering || state.lockedByDot ? "true" : "false";
            };

            if (window.matchMedia('(hover: hover)').matches) {
    card.addEventListener("mouseenter", () => {
        state.isHovering = true;
        syncPauseDataset();
    });

    card.addEventListener("mouseleave", () => {
        state.isHovering = false;
        syncPauseDataset();
    });
}

            const lockUntilReload = () => {
                state.lockedByDot = true;
                syncPauseDataset();
            };

            card.querySelectorAll(".slider-dots label").forEach((dot) => {
                dot.addEventListener("click", lockUntilReload);
            });

            card.querySelectorAll("input[type='radio']").forEach((radio) => {
                radio.addEventListener("change", lockUntilReload);
            });

            syncPauseDataset();
        });
    };

    document.addEventListener("DOMContentLoaded", initPauseControls);
})();

// ================= MENU HAMBÚRGUER =================
document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (!menuIcon || !navLinks) return;

    // abre ou fecha o menu e troca o ícone (☰ ↔ ✕)
    const mostrarMenu = (abrir) => {
        navLinks.classList.toggle('open', abrir);
        menuIcon.classList.toggle('fa-bars', !abrir);
        menuIcon.classList.toggle('fa-xmark', abrir);
        menuIcon.setAttribute('aria-expanded', abrir);
        menuIcon.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    };

    // clicar no ícone alterna
    menuIcon.addEventListener('click', () => {
        mostrarMenu(!navLinks.classList.contains('open'));
    });

    // Enter ou espaço também funcionam (teclado)
    menuIcon.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            mostrarMenu(!navLinks.classList.contains('open'));
        }
    });

    // clicar num link fecha o menu
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => mostrarMenu(false));
    });

    // clicar fora do header fecha o menu
    document.addEventListener('click', (event) => {
        if (!event.target.closest('header')) mostrarMenu(false);
    });

    // Esc fecha o menu
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') mostrarMenu(false);
    });

    // se a tela voltar a ser grande, fecha o menu para não ficar preso aberto
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) mostrarMenu(false);
    });
});

// ================= FORMULÁRIO DE CONTATO (Netlify Forms) =================
document.addEventListener('DOMContentLoaded', () => {
    const formContato = document.getElementById('contactForm');
    const status = document.getElementById('contactStatus');

    if (!formContato || !status) return;

    formContato.addEventListener('submit', async (event) => {
        event.preventDefault();

        status.className = 'contact-status';
        status.textContent = 'Enviando...';

        try {
            const resposta = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(formContato)).toString()
            });

            if (!resposta.ok) throw new Error('Falha no envio');

            formContato.reset();
            status.classList.add('ok');
            status.textContent = 'Mensagem enviada! Responderei em breve.';
        } catch (erro) {
            status.classList.add('erro');
            status.textContent = 'Não foi possível enviar. Tente pelo WhatsApp ou e-mail acima.';
        }
    });
});