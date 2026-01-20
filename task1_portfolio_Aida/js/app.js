const data = {
  "profile": {
    "name": "Аида",
    "title": "3D Художник & Графический Дизайнер",
    "education": "СПбГПУТД, Прикладная информатика в дизайне",
    "description": "Меня зовут Аида. Я учусь в СПбГПУТД на специальности прикладная информатика в дизайне. Моё увлечение — графический дизайн и 3D-моделирование. Я стремлюсь создавать визуально выразительные и функциональные проекты, которые объединяют техническую точность и творческий подход.",
    "avatar": "https://i.pinimg.com/736x/7f/00/14/7f0014b35ecdf2416597f19a12e6537e.jpg"
  },
  "skills": [
    { "name": "ZBrush", "level": 85, "category": "3D" },
    { "name": "Blender", "level": 90, "category": "3D" },
    { "name": "Substance Painter", "level": 80, "category": "Texturing" },
    { "name": "Photoshop", "level": 88, "category": "2D" },
    { "name": "UV-развертка", "level": 82, "category": "Technical" },
    { "name": "Рендеринг", "level": 85, "category": "Technical" },
    { "name": "Концепт-дизайн", "level": 78, "category": "Design" },
    { "name": "Брендирование", "level": 75, "category": "Design" }
  ],
  "portfolio": [
    {
      "id": 1,
      "title": "Эльфийка",
      "category": "characters",
      "image": "img/img_1.png",
      "description": "Высокодетализированная 3D модель, созданный по моему концепт арту",
      "tools": ["ZBrush", "Личный проект", "Blender"],
      "type": "3D Персонаж"
    },
    {
      "id": 2,
      "title": "Магазин",
      "category": "environments",
      "image": "img/port_5.png",
      "description": "Магазин зайчика, который продает молоко",
      "tools": ["Blender", "Туториал"],
      "type": "3D Окружение"
    },
    {
      "id": 3,
      "title": "Концепт арт персонажа",
      "category": "concepts",
      "image": "img/concept1.png",
      "description": "Концепт арт персонажа для игры на подобии Хитмана",
      "tools": ["Photoshop", "Личный проект"],
      "type": "Концепт-дизайн"
    },
    {
      "id": 4,
      "title": "Мультяшные Материалы",
      "category": "textures",
      "image": "img/port_4.png",
      "description": "Создание сцены с панкейками",
      "tools": ["Blender", "Photoshop"],
      "type": "Текстуры"
    },
    {
      "id": 5,
      "title": "Стилизованный Персонаж",
      "category": "characters",
      "image": "img/port_3.png",
      "description": "Мультяшный персонаж с уникальным стилем и яркими текстурами",
      "tools": ["Blender", "Zbrush"],
      "type": "3D Персонаж"
    },
    {
      "id": 6,
      "title": "Cцена кафе",
      "category": "objects",
      "image": "img/port_7.png",
      "description": "Мультяшная визуализация кафе",
      "tools": ["Blender", "Личный проект"],
      "type": "3D Объекты"
    },
    {
      "id": 7,
      "title": "Концепт Арт персонажа в полный рост",
      "category": "concepts",
      "image": "img/concept2.png",
      "description": "Дизайн персонажа для игры Hitman",
      "tools": ["Photoshop", "Figma"],
      "type": "Концепт арт"
    },
    {
      "id": 8,
      "title": "Мультяшный набор текстур",
      "category": "textures",
      "image": "img/port_1.png",
      "description": "Текстуры мультяшного бургера",
      "tools": ["Blender", "Photoshop"],
      "type": "Мультяшная работа"
    }
  ],
  "services": [
    {
      "title": "3D Моделирование",
      "description": "Создание высокодетализированных 3D моделей персонажей, объектов и окружений",
      "icon": "fas fa-cube"
    },
    {
      "title": "Концепт-дизайн",
      "description": "Разработка визуальных концептов для игр, фильмов и рекламных проектов",
      "icon": "fas fa-paint-brush"
    },
    {
      "title": "Текстурирование",
      "description": "Создание реалистичных материалов и текстур в Substance Painter",
      "icon": "fas fa-palette"
    },
    {
      "title": "Рендеринг",
      "description": "Финальная визуализация и постобработка в Blender и Photoshop",
      "icon": "fas fa-camera"
    }
  ]
};

// Глобальные переменные
let currentPage = 'home';
let currentFilter = 'all';
let isDarkTheme = true;
let isAnimating = false;

// Основная инициализация
document.addEventListener('DOMContentLoaded', () => {
  console.log('Портфолио Аиды загружается...');
  
  // Инициализация всех компонентов
  initTheme();
  initNavigation();
  renderServices();
  renderSkills();
  renderPortfolio();
  initPortfolioFilters();
  initModal();
  initContactForm();
  initScrollAnimations();
  
  // Показ начальной страницы с небольшой задержкой
  setTimeout(() => {
    showPage('home');
    animateSkillBars();
  }, 200);
});

// Управление темой
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  // Установка начальной темы
  document.documentElement.setAttribute('data-color-scheme', 'dark');
  applyTheme();
  
  // Обработчик переключения темы
  themeToggle.addEventListener('click', toggleTheme);
}

function applyTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  if (isDarkTheme) {
    document.documentElement.setAttribute('data-color-scheme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.documentElement.setAttribute('data-color-scheme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  applyTheme();
  
  // Плавный переход
  document.body.style.transition = 'all 0.3s ease';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
}

// Навигация
function initNavigation() {
  console.log('Инициализация навигации...');
  
  // Навигационные ссылки
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Клик по навигации:', link.dataset.page);
      
      if (isAnimating) return;
      
      const targetPage = link.dataset.page;
      if (targetPage) {
        navigateToPage(targetPage);
      }
    });
  });

  // Кнопки в герое
  const heroButtons = document.querySelectorAll('.btn[data-page]');
  heroButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Клик по кнопке:', btn.dataset.page);
      
      if (isAnimating) return;
      
      const targetPage = btn.dataset.page;
      if (targetPage) {
        navigateToPage(targetPage);
      }
    });
  });

  // Мобильное меню
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
}

function navigateToPage(pageName) {
  if (isAnimating || currentPage === pageName) return;
  
  console.log('Переход на страницу:', pageName);
  isAnimating = true;
  
  // Анимация исчезновения текущей страницы
  const currentPageEl = document.querySelector(`#${currentPage}`);
  if (currentPageEl && currentPageEl.classList.contains('active')) {
    currentPageEl.style.opacity = '0';
    currentPageEl.style.transform = 'translateY(-20px)';
  }

  setTimeout(() => {
    showPage(pageName);
    currentPage = pageName;
    isAnimating = false;
    
    // Анимация skill bars при переходе на страницу контактов
    if (pageName === 'contact') {
      setTimeout(animateSkillBars, 500);
    }
    
    // Прокрутка к верху
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
}

function showPage(pageName) {
  console.log('Показ страницы:', pageName);
  
  // Обновление активных ссылок в навигации
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.dataset.page === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Скрытие всех страниц
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
    page.style.display = 'none';
    page.style.opacity = '0';
    page.style.transform = 'translateY(20px)';
  });
  
  // Показ целевой страницы
  const targetPage = document.querySelector(`#${pageName}`);
  if (targetPage) {
    targetPage.style.display = 'block';
    targetPage.classList.add('active');
    
    setTimeout(() => {
      targetPage.style.opacity = '1';
      targetPage.style.transform = 'translateY(0)';
    }, 50);
  }
}

function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    const isVisible = navLinks.style.display === 'flex';
    if (isVisible) {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.backgroundColor = 'var(--color-surface)';
      navLinks.style.padding = 'var(--space-16)';
      navLinks.style.boxShadow = 'var(--shadow-lg)';
    }
  }
}

// Рендеринг услуг
function renderServices() {
  const servicesContainer = document.getElementById('services-container');
  if (!servicesContainer) {
    console.log('Контейнер услуг не найден');
    return;
  }
  
  servicesContainer.innerHTML = data.services.map(service => `
    <div class="service-item fade-in-up">
      <div class="service-icon">
        <i class="${service.icon}"></i>
      </div>
      <h3 class="service-title">${service.title}</h3>
      <p class="service-description">${service.description}</p>
    </div>
  `).join('');
  
  console.log('Услуги отрендерены:', data.services.length);
}

// Рендеринг навыков
function renderSkills() {
  console.log('Рендеринг навыков...');
  
  const categories = [
    { selector: '[data-category="3D"]', categories: ['3D'] },
    { selector: '[data-category="Texturing,2D"]', categories: ['Texturing', '2D'] },
    { selector: '[data-category="Design,Technical"]', categories: ['Design', 'Technical'] }
  ];
  
  categories.forEach(categoryGroup => {
    const container = document.querySelector(categoryGroup.selector);
    if (!container) {
      console.log('Контейнер не найден для:', categoryGroup.selector);
      return;
    }
    
    const filteredSkills = data.skills.filter(skill => 
      categoryGroup.categories.includes(skill.category)
    );
    
    container.innerHTML = filteredSkills.map(skill => `
      <div class="skill-item">
        <div class="skill-header">
          <h4 class="skill-name">${skill.name}</h4>
          <span class="skill-level">${skill.level}%</span>
        </div>
        <div class="skill-progress">
          <div class="skill-progress-bar" data-level="${skill.level}"></div>
        </div>
      </div>
    `).join('');
    
    console.log(`Навыки отрендерены для ${categoryGroup.selector}:`, filteredSkills.length);
  });
}

// Анимация skill bars
function animateSkillBars() {
  console.log('Анимация skill bars...');
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  skillBars.forEach((bar, index) => {
    setTimeout(() => {
      const level = bar.dataset.level;
      bar.style.width = `${level}%`;
    }, index * 150);
  });
}

// Портфолио
function renderPortfolio(filter = 'all') {
  const portfolioContainer = document.getElementById('portfolio-container');
  if (!portfolioContainer) {
    console.log('Контейнер портфолио не найден');
    return;
  }
  
  console.log('Рендеринг портфолио с фильтром:', filter);
  
  const filteredProjects = filter === 'all' 
    ? data.portfolio 
    : data.portfolio.filter(project => project.category === filter);

  portfolioContainer.innerHTML = filteredProjects.map(project => `
    <div class="project-card fade-in-up" data-project-id="${project.id}" data-category="${project.category}">
      <div class="project-image" style="background-image: url('${project.image}')">
        <div class="project-overlay">
          <i class="fas fa-search-plus"></i>
        </div>
      </div>
      <div class="project-content">
        <div class="project-type">${project.type}</div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tools">
          ${project.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Добавление обработчиков кликов к карточкам проектов
  setTimeout(() => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const projectId = parseInt(card.dataset.projectId);
        console.log('Клик по проекту:', projectId);
        openProjectModal(projectId);
      });
    });
    console.log('Обработчики кликов добавлены к проектам:', projectCards.length);
  }, 100);
}

// Фильтры портфолио
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  console.log('Инициализация фильтров портфолио:', filterBtns.length);
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isAnimating) return;
      
      const filter = btn.dataset.filter;
      console.log('Фильтр выбран:', filter);
      
      // Обновление активных кнопок
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Рендеринг отфильтрованного портфолио
      currentFilter = filter;
      const portfolioContainer = document.getElementById('portfolio-container');
      if (portfolioContainer) {
        portfolioContainer.style.opacity = '0';
        portfolioContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          renderPortfolio(filter);
          portfolioContainer.style.opacity = '1';
          portfolioContainer.style.transform = 'translateY(0)';
        }, 200);
      }
    });
  });
}

// Модальное окно
function initModal() {
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  
  if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeProjectModal);
  }
  
  // Закрытие по ESC
  document.addEventListener('keydown', (e) => {
    const projectModal = document.getElementById('project-modal');
    if (e.key === 'Escape' && projectModal && !projectModal.classList.contains('hidden')) {
      closeProjectModal();
    }
  });
}

function openProjectModal(projectId) {
  console.log('Открытие модального окна для проекта:', projectId);
  
  const projectModal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  
  if (!projectModal || !modalBody) {
    console.log('Модальное окно или тело модального окна не найдено');
    return;
  }
  
  const project = data.portfolio.find(p => p.id === projectId);
  if (!project) {
    console.log('Проект не найден:', projectId);
    return;
  }

  modalBody.innerHTML = `
    <div class="modal-project-image" style="background-image: url('${project.image}'); width: 100%; height: 300px; background-size: cover; background-position: center; border-radius: var(--radius-base); margin-bottom: var(--space-16);"></div>
    <div style="color: var(--color-primary); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); margin-bottom: var(--space-8);">${project.type}</div>
    <h2 style="font-size: var(--font-size-3xl); margin-bottom: var(--space-16); background: var(--gradient-primary); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">${project.title}</h2>
    <p style="font-size: var(--font-size-lg); line-height: 1.6; margin-bottom: var(--space-24); color: var(--color-text-secondary);">${project.description}</p>
    
    <div style="margin-bottom: var(--space-20);">
      <h4 style="margin-bottom: var(--space-12); font-size: var(--font-size-lg); color: var(--color-primary);">Использованные инструменты:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-8);">
        ${project.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
      </div>
    </div>
    
    <div style="margin-bottom: var(--space-20);">
      <h4 style="margin-bottom: var(--space-12); font-size: var(--font-size-lg); color: var(--color-primary);">Процесс работы:</h4>
      <ul style="margin: 0; padding-left: var(--space-20); color: var(--color-text-secondary);">
        <li style="margin-bottom: var(--space-8); line-height: 1.5;">Создание концепта и референсов</li>
        <li style="margin-bottom: var(--space-8); line-height: 1.5;">Моделирование в ${project.tools.includes('ZBrush') ? 'ZBrush' : 'Blender'}</li>
        ${project.tools.includes('Substance Painter') ? '<li style="margin-bottom: var(--space-8); line-height: 1.5;">Текстурирование в Substance Painter</li>' : ''}
        <li style="margin-bottom: var(--space-8); line-height: 1.5;">Финальный рендеринг и постобработка</li>
      </ul>
    </div>
  `;

  projectModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Анимация появления
  modalBody.style.transform = 'scale(0.9)';
  modalBody.style.opacity = '0';
  
  setTimeout(() => {
    modalBody.style.transform = 'scale(1)';
    modalBody.style.opacity = '1';
    modalBody.style.transition = 'all 0.3s var(--ease-standard)';
  }, 50);
}

function closeProjectModal() {
  const projectModal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  
  if (!projectModal || !modalBody) return;
  
  modalBody.style.transform = 'scale(0.9)';
  modalBody.style.opacity = '0';
  
  setTimeout(() => {
    projectModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 200);
}

// Контактная форма
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) {
    console.log('Контактная форма не найдена');
    return;
  }
  
  contactForm.addEventListener('submit', handleContactForm);
  
  // Стилизация полей формы
  const formControls = contactForm.querySelectorAll('.form-control');
  formControls.forEach(control => {
    control.addEventListener('focus', (e) => {
      e.target.style.borderColor = 'var(--color-primary)';
      e.target.style.boxShadow = '0 0 0 3px rgba(50, 184, 198, 0.1)';
    });
    
    control.addEventListener('blur', (e) => {
      e.target.style.borderColor = '';
      e.target.style.boxShadow = '';
    });
  });
  
  console.log('Контактная форма инициализирована');
}

async function handleContactForm(e) {
  e.preventDefault();
  console.log('Отправка формы...');
  
  const contactForm = document.getElementById('contact-form');
  const formData = new FormData(contactForm);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    projectType: formData.get('project-type'),
    message: formData.get('message')
  };

  // Очистка предыдущих ошибок
  clearFormErrors();

  // Валидация
  const errors = validateForm(data);
  if (Object.keys(errors).length > 0) {
    displayFormErrors(errors);
    return;
  }

  // Показ индикатора загрузки
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  
  if (btnText) btnText.style.display = 'none';
  if (btnLoader) {
    btnLoader.classList.remove('hidden');
    btnLoader.classList.add('visible');
  }
  submitBtn.disabled = true;

  try {
    // Имитация отправки (в реальном проекте здесь был бы fetch запрос)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Успешная отправка
    showFormStatus('success', `Спасибо, ${data.name}! Ваша заявка отправлена. Я свяжусь с вами в ближайшее время для обсуждения проекта.`);
    contactForm.reset();
    
  } catch (error) {
    showFormStatus('error', 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь со мной напрямую.');
  } finally {
    // Скрытие индикатора загрузки
    if (btnText) btnText.style.display = 'inline';
    if (btnLoader) {
      btnLoader.classList.add('hidden');
      btnLoader.classList.remove('visible');
    }
    submitBtn.disabled = false;
  }
}

function validateForm(data) {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = 'Пожалуйста, укажите ваше имя';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа';
  }

  if (!data.email.trim()) {
    errors.email = 'Email обязателен для связи';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Пожалуйста, введите корректный email адрес';
  }

  if (!data.message.trim()) {
    errors.message = 'Опишите ваш проект - это поможет мне лучше понять ваши потребности';
  } else if (data.message.trim().length < 20) {
    errors.message = 'Пожалуйста, расскажите подробнее о проекте (минимум 20 символов)';
  }

  return errors;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function clearFormErrors() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  const errorElements = contactForm.querySelectorAll('.error-message');
  errorElements.forEach(el => el.textContent = '');
  
  const formControls = contactForm.querySelectorAll('.form-control');
  formControls.forEach(el => {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  });
}

function displayFormErrors(errors) {
  Object.keys(errors).forEach(field => {
    const errorElement = document.getElementById(`${field}-error`);
    const inputElement = document.getElementById(field);
    
    if (errorElement) {
      errorElement.textContent = errors[field];
      errorElement.style.color = 'var(--color-error)';
    }
    
    if (inputElement) {
      inputElement.style.borderColor = 'var(--color-error)';
      inputElement.style.boxShadow = '0 0 0 3px rgba(255, 84, 89, 0.1)';
    }
  });
}

function showFormStatus(type, message) {
  const statusElement = document.getElementById('form-status');
  if (!statusElement) return;
  
  statusElement.className = `form-status ${type}`;
  statusElement.textContent = message;
  statusElement.style.display = 'block';
  
  // Анимация появления
  statusElement.style.opacity = '0';
  statusElement.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    statusElement.style.opacity = '1';
    statusElement.style.transform = 'translateY(0)';
    statusElement.style.transition = 'all 0.3s var(--ease-standard)';
  }, 50);
  
  // Автоматическое скрытие через 8 секунд
  setTimeout(() => {
    statusElement.style.opacity = '0';
    setTimeout(() => {
      statusElement.className = 'form-status';
      statusElement.textContent = '';
      statusElement.style.display = 'none';
    }, 300);
  }, 8000);
}

// Анимации при скролле
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Наблюдение за элементами
  setTimeout(() => {
    const animatedElements = document.querySelectorAll('.service-item, .project-card, .skill-item, .stat, .contact-item');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s var(--ease-standard)';
      observer.observe(el);
    });
    console.log('Анимации скролла инициализированы для', animatedElements.length, 'элементов');
  }, 500);
}

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.style.display = '';
      navLinks.style.flexDirection = '';
      navLinks.style.position = '';
      navLinks.style.top = '';
      navLinks.style.left = '';
      navLinks.style.right = '';
      navLinks.style.backgroundColor = '';
      navLinks.style.padding = '';
      navLinks.style.boxShadow = '';
    }
  }
});

// Глобальный объект для отладки
window.aidaPortfolio = {
  navigateToPage,
  showPage,
  toggleTheme,
  openProjectModal,
  closeProjectModal,
  renderPortfolio,
  currentPage: () => currentPage,
  currentFilter: () => currentFilter,
  data
};

console.log('Портфолио Аиды успешно инициализировано!');