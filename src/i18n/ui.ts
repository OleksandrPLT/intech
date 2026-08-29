export const languages = {
	uk: 'UA',
	en: 'EN',
	et: 'ET',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'uk';

export const ui = {
	uk: {
		'nav.home': 'Головна',
		'nav.services': 'Послуги',
		'nav.portfolio': 'Портфоліо',
		'nav.news': 'Новини',
		'nav.about': 'Про мене',
		'nav.contact': 'Контакти',
		'nav.cta': 'Обговорити проект',
		'nav.kursor': 'Kursor',

		'meta.kursor.title': 'Kursor by Intech — власна панель керування сервером',
		'meta.kursor.description':
			'Kursor — власна панель керування сервером на Go: сайти, SSL, VPN, корпоративна пошта, служба підтримки, єдиний вхід. Повний опис і план розвитку.',

		'footer.tagline': 'Веб-розробка та ІТ-інфраструктура з Полтави, Україна.',
		'footer.services': 'Послуги',
		'footer.company': 'Інформація',
		'footer.rights': 'Всі права захищено.',

		'services.title': 'Послуги',
		'services.lede':
			'Від сайту до сервера, на якому він працює. Шість напрямків — можу закрити один з них або весь стек одразу.',
		'services.viewAll': 'Усі послуги',
		'services.learnMore': 'Детальніше',
		'services.included': 'Що входить',
		'services.forWhom': 'Кому підійде',
		'services.back': 'До всіх послуг',

		'portfolio.eyebrow': 'Роботи',
		'portfolio.title': 'Портфоліо',
		'portfolio.lede':
			'Проекти з посиланнями на живі сайти — прев\'ю під кожним завантажується прямо з URL.',
		'portfolio.empty': 'Перші публічні кейси скоро з\'являться тут.',
		'portfolio.visit': 'Відкрити сайт',

		'news.eyebrow': 'Новини',
		'news.title': 'Новини',
		'news.lede': 'Короткі оновлення про сайт, послуги та компанію.',
		'news.readMore': 'Читати',
		'news.back': 'До всіх новин',
		'news.empty': 'Новин поки немає.',
		'news.share': 'Поділитись',
		'news.linkCopied': 'Посилання скопійовано',
		'news.comments.title': 'Коментарі',
		'news.comments.empty': 'Коментарів ще немає — будьте першим.',
		'news.comments.name': "Ім'я",
		'news.comments.body': 'Коментар',
		'news.comments.submit': 'Надіслати',
		'news.comments.pending': "Дякуємо! Коментар з'явиться після модерації.",

		'home.partners.eyebrow': 'Партнери',
		'home.partners.title': 'З ким працюємо',

		'home.hero.eyebrow': 'Веб-розробник · Полтава, Україна',
		'home.hero.title': 'Створюю сайти та ІТ-інфраструктуру, які просто працюють',
		'home.hero.lede':
			'Розробка сайтів і CRM-систем, кастомні проекти під конкретну задачу, налаштування серверів та корпоративного VPN. Один спеціаліст відповідає за весь технічний стек — від фронтенду до продакшн-сервера.',
		'home.hero.ctaPrimary': 'Обговорити проект',
		'home.hero.ctaSecondary': 'Переглянути послуги',

		'home.approach.eyebrow': 'Підхід',
		'home.approach.title': 'Чому саме так',
		'home.approach.items.0.title': 'Повний технічний стек',
		'home.approach.items.0.text':
			'Пишу сайт і CRM, а тоді сам налаштовую сервер і безпеку, на якій вони працюватимуть — не доводиться шукати окремого адміністратора.',
		'home.approach.items.1.title': 'Прозорий процес',
		'home.approach.items.1.text':
			'Погоджуємо обсяг робіт і терміни до старту. Ви знаєте, що і коли отримаєте, без прихованих етапів.',
		'home.approach.items.2.title': 'Українською і по суті',
		'home.approach.items.2.text':
			'Працюю з Полтави, спілкуюся напряму, без посередників — швидкий зв\'язок протягом усього проекту.',

		'home.services.eyebrow': 'Що я роблю',
		'home.services.title': 'Послуги',

		'home.kursor.eyebrow': 'Технологія',
		'home.kursor.title': 'Kursor — власний рушій',
		'home.kursor.lede':
			'Сайт, клієнтський кабінет і CRM працюють на Kursor — системі, яку я розробив і підтримую сам, а не на WordPress чи готовій SaaS-платформі. Те саме можу підключити й до вашого проекту.',
		'home.kursor.features.0.title': 'CRM та ліди',
		'home.kursor.features.0.text': 'Проекти, клієнти, кастомні поля під ваш бізнес — налаштовуються без правок коду.',
		'home.kursor.features.1.title': 'Тікет-система рівня Zendesk',
		'home.kursor.features.1.text': 'Категорії, номери заявок, вкладення, внутрішні нотатки команди, email-сповіщення.',
		'home.kursor.features.2.title': 'CMS без правок коду',
		'home.kursor.features.2.text': 'Новини, портфоліо, послуги та SEO редагуються з адмінки — деплой не потрібен.',
		'home.kursor.features.3.title': 'API для інтеграцій',
		'home.kursor.features.3.text': 'Підключаю тікет-систему напряму до клієнтського сайту чи застосунку.',
		'home.kursor.features.4.title': 'Шифрування доступів',
		'home.kursor.features.4.text': 'Логіни й паролі проектів зберігаються зашифрованими (AES-256), а не у відкритому тексті.',
		'home.kursor.features.5.title': 'Мультимовність з нуля',
		'home.kursor.features.5.text': 'Українська, англійська, естонська — на рівні архітектури, не плагіном поверх.',
		'home.kursor.readMore': 'Детальніше про Kursor →',

		'home.cta.title': 'Маєте задачу — обговоримо, як її вирішити',
		'home.cta.text': 'Опишіть проект, і я скажу, що для нього реально потрібно.',
		'home.cta.button': "Зв'язатися",

		'about.eyebrow': 'Про мене',
		'about.name': 'Олександр Левков',
		'about.title': 'Веб-розробник із Полтави',
		'about.p1':
			'Займаюся веб-розробкою та ІТ-інфраструктурою: від сайтів і CRM-систем до серверів, на яких вони працюють. Веду проекти самостійно, від першої розмови до релізу й подальшої підтримки.',
		'about.p2':
			'Полтава, Україна. Наразі працюю як приватний спеціаліст, у планах — реєстрація компанії в Україні та Естонії, щоб узяти більше проектів і побудувати команду.',
		'about.stackTitle': 'З чим працюю',

		'contact.eyebrow': "Зв'язок",
		'contact.title': "Обговорімо ваш проект",
		'contact.text':
			'Найшвидше — писати напряму. Коротко опишіть задачу, і я відповім із першими питаннями та орієнтовними термінами.',
		'contact.emailLabel': 'Email',
		'contact.telegramLabel': 'Telegram',
		'contact.locationLabel': 'Локація',
		'contact.location': 'Полтава, Україна',
		'contact.or': 'Або залиште заявку',
		'contact.form.name': "Ім'я",
		'contact.form.contact': 'Email або телефон',
		'contact.form.service': 'Яка послуга цікавить',
		'contact.form.serviceEmpty': '— оберіть (необов\'язково) —',
		'contact.form.message': 'Коротко про задачу',
		'contact.form.submit': 'Надіслати заявку',
		'contact.form.success': "Дякуємо! Заявку отримано, зв'яжемось найближчим часом.",
		'contact.form.error': "Вкажіть ім'я та контакт для зв'язку.",

		'meta.home.title': 'intech.org.ua — веб-розробка та ІТ-інфраструктура, Полтава',
		'meta.home.description':
			'Розробка сайтів, CRM-систем і кастомних проектів, налаштування серверів та корпоративного VPN. Веб-розробник з Полтави, Україна.',
		'meta.services.title': 'Послуги — intech.org.ua',
		'meta.services.description':
			'Розробка сайтів, CRM-системи, кастомні проекти, корпоративний VPN, налаштування серверів, редизайн сайтів.',
		'meta.portfolio.title': 'Портфоліо — intech.org.ua',
		'meta.portfolio.description': 'Проекти з посиланнями на живі сайти.',
		'meta.news.title': 'Новини — intech.org.ua',
		'meta.news.description': 'Оновлення про сайт, послуги та компанію.',
		'meta.about.title': 'Про мене — intech.org.ua',
		'meta.about.description': 'Веб-розробник з Полтави, Україна: сайти, CRM-системи, сервери.',
		'meta.contact.title': 'Контакти — intech.org.ua',
		'meta.contact.description': "Зв'яжіться, щоб обговорити проект.",
	},
	en: {
		'nav.home': 'Home',
		'nav.services': 'Services',
		'nav.portfolio': 'Portfolio',
		'nav.news': 'News',
		'nav.about': 'About',
		'nav.contact': 'Contact',
		'nav.cta': 'Discuss a project',
		'nav.kursor': 'Kursor',

		'meta.kursor.title': 'Kursor by Intech — our own server control panel',
		'meta.kursor.description':
			'Kursor is our own server control panel built in Go: sites, SSL, VPN, corporate email, service desk, single sign-on. Full description and roadmap.',

		'footer.tagline': 'Web development and IT infrastructure from Poltava, Ukraine.',
		'footer.services': 'Services',
		'footer.company': 'Company',
		'footer.rights': 'All rights reserved.',

		'services.title': 'Services',
		'services.lede':
			"From the website to the server it runs on. Six areas — hire me for one of them, or the whole stack at once.",
		'services.viewAll': 'All services',
		'services.learnMore': 'Learn more',
		'services.included': "What's included",
		'services.forWhom': 'Who it fits',
		'services.back': 'Back to services',

		'portfolio.eyebrow': 'Work',
		'portfolio.title': 'Portfolio',
		'portfolio.lede': 'Projects linked to their live sites — each preview loads straight from the URL.',
		'portfolio.empty': 'The first public case studies are coming soon.',
		'portfolio.visit': 'Visit site',

		'news.eyebrow': 'News',
		'news.title': 'News',
		'news.lede': 'Short updates about the site, services, and the company.',
		'news.readMore': 'Read',
		'news.back': 'Back to news',
		'news.empty': 'No news yet.',
		'news.share': 'Share',
		'news.linkCopied': 'Link copied',
		'news.comments.title': 'Comments',
		'news.comments.empty': 'No comments yet — be the first.',
		'news.comments.name': 'Name',
		'news.comments.body': 'Comment',
		'news.comments.submit': 'Send',
		'news.comments.pending': 'Thanks! Your comment will appear after moderation.',

		'home.partners.eyebrow': 'Partners',
		'home.partners.title': 'Who we work with',

		'home.hero.eyebrow': 'Web developer · Poltava, Ukraine',
		'home.hero.title': 'Websites and IT infrastructure that just work',
		'home.hero.lede':
			'Website and CRM development, custom projects built for a specific task, server setup and corporate VPN configuration. One person accountable for the whole technical stack — from the frontend to the production server.',
		'home.hero.ctaPrimary': 'Discuss a project',
		'home.hero.ctaSecondary': 'View services',

		'home.approach.eyebrow': 'Approach',
		'home.approach.title': 'Why it works this way',
		'home.approach.items.0.title': 'Full technical stack',
		'home.approach.items.0.text':
			"I build the website or CRM, then configure the server and security it runs on myself — no need to find a separate sysadmin.",
		'home.approach.items.1.title': 'Transparent process',
		'home.approach.items.1.text':
			"Scope and timeline are agreed before the start. You know what you'll get and when — no hidden stages.",
		'home.approach.items.2.title': 'Direct communication',
		'home.approach.items.2.text':
			'Based in Poltava, no middlemen — quick, direct contact throughout the whole project.',

		'home.services.eyebrow': 'What I do',
		'home.services.title': 'Services',

		'home.kursor.eyebrow': 'Technology',
		'home.kursor.title': 'Kursor — our own engine',
		'home.kursor.lede':
			"The site, client cabinet, and CRM run on Kursor — a system I built and maintain myself, not WordPress or an off-the-shelf SaaS platform. I can plug the same engine into your project.",
		'home.kursor.features.0.title': 'CRM & leads',
		'home.kursor.features.0.text': 'Projects, clients, custom fields tailored to your business — configured with no code changes.',
		'home.kursor.features.1.title': 'Zendesk-grade ticketing',
		'home.kursor.features.1.text': 'Categories, ticket numbers, attachments, internal team notes, email notifications.',
		'home.kursor.features.2.title': 'No-code CMS',
		'home.kursor.features.2.text': 'News, portfolio, services, and SEO are edited from the admin panel — no deploy needed.',
		'home.kursor.features.3.title': 'API for integrations',
		'home.kursor.features.3.text': "I wire the ticket system directly into a client's own site or app.",
		'home.kursor.features.4.title': 'Encrypted credentials',
		'home.kursor.features.4.text': 'Project logins and passwords are stored encrypted (AES-256), never in plain text.',
		'home.kursor.features.5.title': 'Multilingual from day one',
		'home.kursor.features.5.text': 'Ukrainian, English, Estonian — built into the architecture, not bolted on as a plugin.',
		'home.kursor.readMore': 'More about Kursor →',

		'home.cta.title': "Have a task? Let's work out how to solve it",
		'home.cta.text': "Describe the project, and I'll tell you what it actually needs.",
		'home.cta.button': 'Get in touch',

		'about.eyebrow': 'About',
		'about.name': 'Oleksandr Levkov',
		'about.title': 'Web developer based in Poltava',
		'about.p1':
			'I work across web development and IT infrastructure: websites, CRM systems, and the servers that run them. I run projects end to end, from the first conversation through release and ongoing support.',
		'about.p2':
			"Based in Poltava, Ukraine. Currently working as an independent specialist, with plans to register a company in both Ukraine and Estonia to take on more projects and build a team.",
		'about.stackTitle': 'What I work with',

		'contact.eyebrow': 'Contact',
		'contact.title': "Let's discuss your project",
		'contact.text':
			"The fastest way is to write directly. Briefly describe the task, and I'll reply with initial questions and a rough timeline.",
		'contact.emailLabel': 'Email',
		'contact.telegramLabel': 'Telegram',
		'contact.locationLabel': 'Location',
		'contact.location': 'Poltava, Ukraine',
		'contact.or': 'Or leave a request',
		'contact.form.name': 'Name',
		'contact.form.contact': 'Email or phone',
		'contact.form.service': 'Which service are you interested in',
		'contact.form.serviceEmpty': '— choose (optional) —',
		'contact.form.message': 'Briefly describe the task',
		'contact.form.submit': 'Send request',
		'contact.form.success': "Thank you! We've received your request and will be in touch soon.",
		'contact.form.error': 'Please provide your name and a way to reach you.',

		'meta.home.title': 'intech.org.ua — web development & IT infrastructure, Poltava',
		'meta.home.description':
			'Website and CRM development, custom projects, server setup and corporate VPN. Web developer based in Poltava, Ukraine.',
		'meta.services.title': 'Services — intech.org.ua',
		'meta.services.description':
			'Website development, CRM systems, custom projects, corporate VPN, server setup, website redesign.',
		'meta.portfolio.title': 'Portfolio — intech.org.ua',
		'meta.portfolio.description': 'Projects linked to their live sites.',
		'meta.news.title': 'News — intech.org.ua',
		'meta.news.description': 'Updates about the site, services, and the company.',
		'meta.about.title': 'About — intech.org.ua',
		'meta.about.description': 'Web developer based in Poltava, Ukraine: websites, CRM systems, servers.',
		'meta.contact.title': 'Contact — intech.org.ua',
		'meta.contact.description': 'Get in touch to discuss your project.',
	},
	et: {
		'nav.home': 'Avaleht',
		'nav.services': 'Teenused',
		'nav.portfolio': 'Portfoolio',
		'nav.news': 'Uudised',
		'nav.about': 'Minust',
		'nav.contact': 'Kontakt',
		'nav.cta': 'Arutame projekti',
		'nav.kursor': 'Kursor',

		'meta.kursor.title': 'Kursor by Intech — oma serveri haldpaneel',
		'meta.kursor.description':
			'Kursor on meie enda Go-s ehitatud serveri haldpaneel: saidid, SSL, VPN, ettevõtte meil, klienditugi, ühekordne sisselogimine. Täielik kirjeldus ja arenduskava.',

		'footer.tagline': 'Veebiarendus ja IT-infrastruktuur Poltavast, Ukrainast.',
		'footer.services': 'Teenused',
		'footer.company': 'Info',
		'footer.rights': 'Kõik õigused kaitstud.',

		'services.title': 'Teenused',
		'services.lede':
			'Veebisaidist serverini, millel see töötab. Kuus valdkonda — tellige üks neist või kogu tehnoloogiapakett korraga.',
		'services.viewAll': 'Kõik teenused',
		'services.learnMore': 'Loe lähemalt',
		'services.included': 'Mis kuulub hulka',
		'services.forWhom': 'Kellele sobib',
		'services.back': 'Tagasi teenuste juurde',

		'portfolio.eyebrow': 'Tööd',
		'portfolio.title': 'Portfoolio',
		'portfolio.lede':
			'Projektid koos linkidega päriselt töötavatele saitidele — eelvaade laetakse otse URL-ilt.',
		'portfolio.empty': 'Esimesed avalikud näited ilmuvad siia peagi.',
		'portfolio.visit': 'Ava sait',

		'news.eyebrow': 'Uudised',
		'news.title': 'Uudised',
		'news.lede': 'Lühiuudised saidi, teenuste ja ettevõtte kohta.',
		'news.readMore': 'Loe edasi',
		'news.back': 'Tagasi uudiste juurde',
		'news.empty': 'Uudiseid veel ei ole.',
		'news.share': 'Jaga',
		'news.linkCopied': 'Link kopeeritud',
		'news.comments.title': 'Kommentaarid',
		'news.comments.empty': 'Kommentaare pole veel — ole esimene.',
		'news.comments.name': 'Nimi',
		'news.comments.body': 'Kommentaar',
		'news.comments.submit': 'Saada',
		'news.comments.pending': 'Aitäh! Kommentaar ilmub pärast modereerimist.',

		'home.partners.eyebrow': 'Partnerid',
		'home.partners.title': 'Kellega töötame',

		'home.hero.eyebrow': 'Veebiarendaja · Poltava, Ukraina',
		'home.hero.title': 'Loon veebisaite ja IT-infrastruktuuri, mis lihtsalt töötavad',
		'home.hero.lede':
			'Veebisaitide ja CRM-süsteemide arendus, kohandatud lahendused konkreetse ülesande jaoks, serverite ja ettevõtte VPN-i seadistamine. Üks spetsialist vastutab kogu tehnoloogiapaketi eest — esikülje koodist kuni tootmisserverini.',
		'home.hero.ctaPrimary': 'Arutame projekti',
		'home.hero.ctaSecondary': 'Vaata teenuseid',

		'home.approach.eyebrow': 'Lähenemine',
		'home.approach.title': 'Miks just nii',
		'home.approach.items.0.title': 'Terviklik tehnoloogiapakett',
		'home.approach.items.0.text':
			'Loon veebisaidi või CRM-i ning seadistan seejärel ise ka serveri ja turvalisuse, millel need töötavad — eraldi süsteemiadministraatorit pole vaja otsida.',
		'home.approach.items.1.title': 'Läbipaistev protsess',
		'home.approach.items.1.text':
			'Töömaht ja ajakava lepitakse kokku enne alustamist. Te teate, mida ja millal saate — ilma varjatud etappideta.',
		'home.approach.items.2.title': 'Otsesuhtlus',
		'home.approach.items.2.text':
			'Töötan Poltavast, vahendajateta — kiire ja otsene suhtlus kogu projekti vältel.',

		'home.services.eyebrow': 'Mida ma teen',
		'home.services.title': 'Teenused',

		'home.kursor.eyebrow': 'Tehnoloogia',
		'home.kursor.title': 'Kursor — meie oma mootor',
		'home.kursor.lede':
			'Veebisait, kliendikabinet ja CRM töötavad Kursoril — süsteemil, mille ma ise arendasin ja haldan, mitte WordPressil ega valmis SaaS-platvormil. Sama mootori saan ühendada ka teie projektiga.',
		'home.kursor.features.0.title': 'CRM ja müügivihjed',
		'home.kursor.features.0.text': 'Projektid, kliendid, teie ärile kohandatud lisaväljad — seadistatavad koodi muutmata.',
		'home.kursor.features.1.title': 'Zendesk-tasemel piletisüsteem',
		'home.kursor.features.1.text': 'Kategooriad, piletinumbrid, manused, meeskonna sisemärkmed, e-kirja teavitused.',
		'home.kursor.features.2.title': 'CMS ilma koodita',
		'home.kursor.features.2.text': 'Uudised, portfoolio, teenused ja SEO muudetavad admin-paneelist — juurutust pole vaja.',
		'home.kursor.features.3.title': 'API integratsioonideks',
		'home.kursor.features.3.text': 'Ühendan piletisüsteemi otse kliendi enda saidi või rakendusega.',
		'home.kursor.features.4.title': 'Krüpteeritud ligipääsud',
		'home.kursor.features.4.text': 'Projektide kasutajanimed ja paroolid säilitatakse krüpteerituna (AES-256), mitte lihttekstina.',
		'home.kursor.features.5.title': 'Mitmekeelsus algusest peale',
		'home.kursor.features.5.text': 'Ukraina, inglise, eesti keel — arhitektuuri, mitte lisandmooduli tasemel.',
		'home.kursor.readMore': 'Rohkem Kursorist →',

		'home.cta.title': 'Kas teil on ülesanne? Arutame, kuidas seda lahendada',
		'home.cta.text': 'Kirjeldage projekti ja ma ütlen, mida see tegelikult vajab.',
		'home.cta.button': 'Võtke ühendust',

		'about.eyebrow': 'Minust',
		'about.name': 'Oleksandr Levkov',
		'about.title': 'Veebiarendaja Poltavast',
		'about.p1':
			'Tegelen veebiarenduse ja IT-infrastruktuuriga: veebisaitidest ja CRM-süsteemidest kuni serveriteni, millel need töötavad. Viin projektid läbi algusest lõpuni — esimesest vestlusest kuni väljalaske ja edasise toeni.',
		'about.p2':
			'Poltava, Ukraina. Praegu töötan sõltumatu spetsialistina, plaanis on registreerida ettevõte nii Ukrainas kui Eestis, et võtta vastu rohkem projekte ja luua meeskond.',
		'about.stackTitle': 'Millega töötan',

		'contact.eyebrow': 'Kontakt',
		'contact.title': 'Arutame teie projekti',
		'contact.text':
			'Kiireim viis on kirjutada otse. Kirjeldage lühidalt ülesannet ja ma vastan esimeste küsimuste ning orienteeruva ajakavaga.',
		'contact.emailLabel': 'E-post',
		'contact.telegramLabel': 'Telegram',
		'contact.locationLabel': 'Asukoht',
		'contact.location': 'Poltava, Ukraina',
		'contact.or': 'Või jätke päring',
		'contact.form.name': 'Nimi',
		'contact.form.contact': 'E-post või telefon',
		'contact.form.service': 'Milline teenus huvitab',
		'contact.form.serviceEmpty': '— vali (valikuline) —',
		'contact.form.message': 'Lühidalt ülesandest',
		'contact.form.submit': 'Saada päring',
		'contact.form.success': 'Aitäh! Päring on vastu võetud, võtame peagi ühendust.',
		'contact.form.error': 'Palun sisestage nimi ja kontaktandmed.',

		'meta.home.title': 'intech.org.ua — veebiarendus ja IT-infrastruktuur, Poltava',
		'meta.home.description':
			'Veebisaitide ja CRM-süsteemide arendus, kohandatud projektid, serverite ja ettevõtte VPN-i seadistamine. Veebiarendaja Poltavast, Ukrainast.',
		'meta.services.title': 'Teenused — intech.org.ua',
		'meta.services.description':
			'Veebisaitide arendus, CRM-süsteemid, kohandatud projektid, ettevõtte VPN, serverite seadistamine, veebisaidi uuendus.',
		'meta.portfolio.title': 'Portfoolio — intech.org.ua',
		'meta.portfolio.description': 'Projektid koos linkidega päriselt töötavatele saitidele.',
		'meta.news.title': 'Uudised — intech.org.ua',
		'meta.news.description': 'Uudised saidi, teenuste ja ettevõtte kohta.',
		'meta.about.title': 'Minust — intech.org.ua',
		'meta.about.description': 'Veebiarendaja Poltavast, Ukrainast: veebisaidid, CRM-süsteemid, serverid.',
		'meta.contact.title': 'Kontakt — intech.org.ua',
		'meta.contact.description': 'Võtke minuga ühendust, et oma projekti arutada.',
	},
} as const;

export type UiKey = keyof (typeof ui)['uk'];
