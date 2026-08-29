/**
 * Full "Kursor by Intech" product page content — the real in-house VPS
 * control panel (Go, sqlite, single binary, no Docker), not to be confused
 * with the marketing blurb on the homepage (KursorSection.astro), which
 * stays a short teaser linking here. Content supplied directly by the
 * business owner; kept close to the original Ukrainian wording rather than
 * paraphrased, and translated (not auto-generated filler) for en/et.
 */

export type KursorLang = 'uk' | 'en' | 'et';

export interface KursorItem {
	title: string;
	description: string;
}

export interface KursorModuleGroup {
	category: string;
	items: KursorItem[];
}

export interface KursorContent {
	eyebrow: string;
	title: string;
	subtitle: string;
	introTitle: string;
	intro: string[];
	modulesTitle: string;
	modules: KursorModuleGroup[];
	roadmapTitle: string;
	roadmapNearTitle: string;
	roadmapNear: KursorItem[];
	roadmapLongTitle: string;
	roadmapLong: KursorItem[];
	ctaText: string;
	ctaButton: string;
}

const content: Record<KursorLang, KursorContent> = {
	uk: {
		eyebrow: 'Власна розробка',
		title: 'Kursor by Intech',
		subtitle: 'Панель керування сервером, написана з нуля на Go',
		introTitle: 'Що це',
		intro: [
			'Kursor — власна панель керування сервером, написана Intech з нуля на Go: аналог aaPanel/1Panel, але зроблена під конкретні потреби компанії, а не як універсальний продукт для всіх.',
			'Один бінарник, SQLite, нативний systemd-сервіс — без Docker, без зайвих шарів абстракції. Ідея: не платити за десяток окремих SaaS-підписок (хостинг-панель, пошта, тікет-система, VPN-сервіс), а мати все під власним контролем, на власному залізі.',
		],
		modulesTitle: 'Модулі',
		modules: [
			{
				category: 'Сервер',
				items: [
					{
						title: 'Сайти',
						description:
							"Створення/видалення, автогенерація й перевірка nginx-конфігів перед застосуванням (тест конфігу → symlink → reload, з відкатом при помилці).",
					},
					{ title: 'SSL', description: "Випуск і автопродовження сертифікатів Let's Encrypt прямо з інтерфейсу." },
					{
						title: 'Файловий менеджер',
						description: 'Перегляд, редагування, завантаження/вивантаження файлів у межах безпечного кореня (захист від виходу за межі директорії).',
					},
					{ title: 'Менеджер баз даних', description: 'Керування базами й користувачами.' },
					{ title: 'Cron', description: "Задачі за розкладом через інтерфейс, без ручного crontab -e." },
					{ title: 'Бекапи', description: 'Створення й завантаження резервних копій.' },
					{ title: 'Термінал', description: 'Повноцінна веб-консоль прямо в браузері.' },
					{ title: 'Моніторинг', description: 'Живі показники CPU/RAM/диска/мережі.' },
				],
			},
			{
				category: 'Мережа',
				items: [
					{
						title: 'Домени та DNS',
						description:
							'Керування записами, включно з власним NS-сервером (можна бути власним реєстратором DNS-зони, не залежати лише від реєстратора домену).',
					},
					{ title: 'Порти / Firewall', description: 'Точкове відкриття/закриття портів, проброс.' },
					{ title: 'VPN', description: 'WireGuard, видача конфігів співробітникам прямо з панелі (не окремий сервіс).' },
					{ title: 'SSH', description: 'Керування ключами й системними користувачами сервера.' },
				],
			},
			{
				category: 'Компанія',
				items: [
					{
						title: 'Акаунти співробітників',
						description:
							'ПІБ, підрозділ, посада, роль, гранульовані права доступу по кожному модулю окремо (не «все або нічого»), фото, звільнення з фіксацією дати, скидання пароля.',
					},
					{ title: 'Підрозділи й посади', description: 'Власна оргструктура з ієрархією.' },
					{
						title: 'Корпоративна пошта',
						description:
							"Власний поштовий сервер (WildDuck + Haraka + ZoneMTA), а не орендований сервіс. Реальні SPF/DKIM/DMARC/PTR — пошта не падає в спам. Акаунт співробітника й поштова скринька створюються одночасно, одним логіном і паролем — не два окремих креденшели.",
					},
					{
						title: 'Спільні поштові скриньки',
						description:
							'info@, sales@ — доступ дається конкретним людям без спільного пароля на руках; кожен надісланий лист позначено, хто саме з команди його написав — легко зрозуміти, хто відповідав клієнту.',
					},
					{
						title: 'Служба підтримки (Service Desk)',
						description: 'Категорії звернень, погодження, ескалація між групами підтримки, окремий клієнтський портал на власному піддомені.',
					},
					{
						title: 'Єдиний вхід (SSO)',
						description:
							'Один логін і пароль для панелі, пошти й кабінету сайту компанії. Заходиш в один сервіс — автоматично залогинений і в інших, без повторного вводу пароля. Доступ до кожного сервісу вмикається окремо для кожного співробітника.',
					},
				],
			},
			{
				category: 'Система',
				items: [
					{ title: 'Аудит-лог', description: 'Хто, що і коли змінив у панелі.' },
					{ title: 'Сповіщення', description: 'Дзвіночок з подіями (нові тікети, надання доступу тощо).' },
					{ title: 'OAuth2/OIDC', description: 'Можна підключати власні проєкти як клієнтів, авторизуючись через Kursor.' },
					{ title: 'API-ключі', description: "Для інтеграцій ззовні, прив'язані до конкретного проєкту." },
					{
						title: 'Тонке налаштування панелі',
						description: 'Власний домен для панелі, зміна порту, білий список IP-адрес, захист від перебору пароля (блокування після невдалих спроб).',
					},
				],
			},
		],
		roadmapTitle: 'Що ще буде реалізовано',
		roadmapNearTitle: 'Найближче',
		roadmapNear: [
			{ title: 'Двофакторна автентифікація (2FA)', description: 'Додатковий код при вході — поки не реалізовано.' },
			{
				title: 'Інтеграція заявок із сайту в Service Desk',
				description: "Технічна заявка з форми на сайті одразу падає тікетом у внутрішню службу підтримки, з кнопкою «маршрутизувати до розробника».",
			},
			{
				title: 'Посилення безпеки самої панелі',
				description: 'Закриття прямого доступу по IP:порт ззовні (лишити лише через власний домен з HTTPS), обов\'язкове шифрування сесійної куки.',
			},
		],
		roadmapLongTitle: 'Довгостроково',
		roadmapLong: [
			{
				title: 'Розширення єдиного входу',
				description: 'На всі нові внутрішні сервіси автоматично, за тим самим принципом.',
			},
			{
				title: 'Єдиний вхід у робочі комп\'ютери',
				description: 'Амбіція на майбутнє — той самий єдиний логін/пароль для входу і в робочі комп\'ютери співробітників (не лише у веб-сервіси), окремий, складніший протокол авторизації.',
			},
		],
		ctaText: 'Той самий рушій, ту саму дисципліну в інфраструктурі можу поставити і на ваш проект.',
		ctaButton: 'Обговорити проект',
	},
	en: {
		eyebrow: 'In-house build',
		title: 'Kursor by Intech',
		subtitle: 'A server control panel written from scratch in Go',
		introTitle: 'What it is',
		intro: [
			'Kursor is our own server control panel, built by Intech from scratch in Go — an aaPanel/1Panel alternative, but built for the company\'s actual needs rather than as a one-size-fits-all product.',
			'A single binary, SQLite, a native systemd service — no Docker, no extra layers of abstraction. The idea: instead of paying for a dozen separate SaaS subscriptions (hosting panel, mail, ticketing, VPN service), keep everything under our own control, on our own hardware.',
		],
		modulesTitle: 'Modules',
		modules: [
			{
				category: 'Server',
				items: [
					{
						title: 'Sites',
						description: 'Create/remove sites, auto-generates and validates nginx configs before applying (test config → symlink → reload, with rollback on failure).',
					},
					{ title: 'SSL', description: "Issues and auto-renews Let's Encrypt certificates right from the interface." },
					{
						title: 'File manager',
						description: 'Browse, edit, upload/download files within a sandboxed root (protected against path traversal).',
					},
					{ title: 'Database manager', description: 'Manage databases and their users.' },
					{ title: 'Cron', description: 'Scheduled jobs through the interface — no manual crontab -e.' },
					{ title: 'Backups', description: 'Create and download backups.' },
					{ title: 'Terminal', description: 'A full web console right in the browser.' },
					{ title: 'Monitoring', description: 'Live CPU/RAM/disk/network metrics.' },
				],
			},
			{
				category: 'Network',
				items: [
					{
						title: 'Domains & DNS',
						description: 'Manage DNS records, including our own NS server (you can be your own DNS-zone registrar, not just rely on the domain registrar).',
					},
					{ title: 'Ports / Firewall', description: 'Fine-grained port open/close, port forwarding.' },
					{ title: 'VPN', description: 'WireGuard, issuing configs to employees straight from the panel (not a separate service).' },
					{ title: 'SSH', description: 'Manage keys and the server\'s system users.' },
				],
			},
			{
				category: 'Company',
				items: [
					{
						title: 'Employee accounts',
						description:
							'Full name, department, role, granular per-module access rights (not "all or nothing"), photo, termination with a recorded date, password reset.',
					},
					{ title: 'Departments & positions', description: 'A real org structure with hierarchy.' },
					{
						title: 'Corporate email',
						description:
							"Our own mail server (WildDuck + Haraka + ZoneMTA), not a rented service. Real SPF/DKIM/DMARC/PTR — mail doesn't land in spam. An employee's account and mailbox are created together, with one login and password — not two separate credentials.",
					},
					{
						title: 'Shared mailboxes',
						description:
							'info@, sales@ — access is granted to specific people without a shared password floating around; every sent email is tagged with who on the team actually wrote it, so it\'s easy to see who answered a client.',
					},
					{
						title: 'Service Desk',
						description: 'Ticket categories, approvals, escalation between support groups, a separate client portal on its own subdomain.',
					},
					{
						title: 'Single sign-on (SSO)',
						description:
							"One login and password for the panel, mail and the company site's cabinet. Log into one service and you're automatically signed into the others, no re-entering a password. Access to each service is toggled per employee.",
					},
				],
			},
			{
				category: 'System',
				items: [
					{ title: 'Audit log', description: 'Who changed what in the panel, and when.' },
					{ title: 'Notifications', description: 'A bell with events (new tickets, access granted, etc.).' },
					{ title: 'OAuth2/OIDC', description: 'Our own projects can be plugged in as clients, authenticating through Kursor.' },
					{ title: 'API keys', description: 'For outside integrations, scoped to a specific project.' },
					{
						title: 'Panel hardening',
						description: 'A custom domain for the panel, port change, IP allowlist, brute-force protection (lockout after failed attempts).',
					},
				],
			},
		],
		roadmapTitle: "What's coming",
		roadmapNearTitle: 'Near-term',
		roadmapNear: [
			{ title: 'Two-factor authentication (2FA)', description: 'An extra code at login — not implemented yet.' },
			{
				title: 'Website requests → Service Desk',
				description: "A technical request from the site's form drops straight into the internal support desk as a ticket, with a \"route to developer\" button.",
			},
			{
				title: 'Hardening the panel itself',
				description: 'Closing direct IP:port access from the outside (leave only its own domain over HTTPS), mandatory session cookie encryption.',
			},
		],
		roadmapLongTitle: 'Long-term',
		roadmapLong: [
			{ title: 'Extending single sign-on', description: 'Automatically to every new internal service, on the same principle.' },
			{
				title: 'Single sign-on for workstations',
				description: "A future ambition — the same single login/password for logging into employees' work computers too (not just web services), via a separate, more rigorous auth protocol.",
			},
		],
		ctaText: 'The same engine, the same infrastructure discipline — I can set it up for your project too.',
		ctaButton: 'Discuss a project',
	},
	et: {
		eyebrow: 'Oma arendus',
		title: 'Kursor by Intech',
		subtitle: 'Serveri haldpaneel, kirjutatud nullist Go-s',
		introTitle: 'Mis see on',
		intro: [
			'Kursor on Intechi enda serveri haldpaneel, mis on nullist kirjutatud Go-s — aaPanel/1Panel alternatiiv, kuid ehitatud ettevõtte konkreetsete vajaduste, mitte universaalse toote jaoks.',
			'Üks binaarfail, SQLite, natiivne systemd-teenus — ilma Dockerita, ilma liigsete abstraktsioonikihtideta. Idee: mitte maksta kümne eraldi SaaS-tellimuse eest (hostingpaneel, meil, piletisüsteem, VPN-teenus), vaid hoida kõik enda kontrolli all, oma riistvaral.',
		],
		modulesTitle: 'Moodulid',
		modules: [
			{
				category: 'Server',
				items: [
					{
						title: 'Saidid',
						description: 'Saitide loomine/kustutamine, nginx-konfiguratsioonide automaatne genereerimine ja valideerimine enne rakendamist (konfiguratsiooni test → sümbolviide → taaskäivitus, veaga tagasipööramine).',
					},
					{ title: 'SSL', description: "Let's Encrypt sertifikaatide väljastamine ja automaatne uuendamine otse liidesest." },
					{
						title: 'Failihaldur',
						description: 'Failide vaatamine, muutmine, üles-/allalaadimine turvalise juurkataloogi piires (kaitse kataloogist väljumise eest).',
					},
					{ title: 'Andmebaasihaldur', description: 'Andmebaaside ja kasutajate haldamine.' },
					{ title: 'Cron', description: 'Ajastatud ülesanded liidese kaudu — ilma käsitsi crontab -e käsuta.' },
					{ title: 'Varukoopiad', description: 'Varukoopiate loomine ja allalaadimine.' },
					{ title: 'Terminal', description: 'Täisväärtuslik veebikonsool otse brauseris.' },
					{ title: 'Monitooring', description: 'CPU/RAM/kettaruumi/võrgu näitajad reaalajas.' },
				],
			},
			{
				category: 'Võrk',
				items: [
					{
						title: 'Domeenid ja DNS',
						description: 'Kirjete haldamine, sh oma NS-server (saab olla oma DNS-tsooni registripidaja, mitte sõltuda ainult domeeni registripidajast).',
					},
					{ title: 'Pordid / Firewall', description: 'Portide avamine/sulgemine, port forwarding.' },
					{ title: 'VPN', description: 'WireGuard, konfiguratsioonide väljastamine töötajatele otse paneelist (mitte eraldi teenusena).' },
					{ title: 'SSH', description: 'Serveri võtmete ja süsteemikasutajate haldamine.' },
				],
			},
			{
				category: 'Ettevõte',
				items: [
					{
						title: 'Töötajate kontod',
						description: 'Nimi, osakond, ametikoht, roll, detailsed õigused iga mooduli kohta eraldi (mitte "kõik või mitte midagi"), foto, vallandamine kuupäevaga, parooli lähtestamine.',
					},
					{ title: 'Osakonnad ja ametikohad', description: 'Oma organisatsioonistruktuur koos hierarhiaga.' },
					{
						title: 'Ettevõtte meil',
						description:
							'Oma meiliserver (WildDuck + Haraka + ZoneMTA), mitte renditud teenus. Korralik SPF/DKIM/DMARC/PTR — kirjad ei satu rämpsposti. Töötaja konto ja postkast luuakse korraga, ühe kasutajanime ja parooliga — mitte kahe eraldi mandaadiga.',
					},
					{
						title: 'Jagatud postkastid',
						description:
							'info@, sales@ — juurdepääs antakse konkreetsetele inimestele ilma jagatud paroolita; iga saadetud kiri on märgistatud, kes meeskonnast selle tegelikult kirjutas — kergesti näha, kes kliendile vastas.',
					},
					{
						title: 'Klienditugi (Service Desk)',
						description: 'Pöördumiste kategooriad, kinnitused, eskaleerimine tugigruppide vahel, eraldi kliendiportaal omal alamdomeenil.',
					},
					{
						title: 'Ühekordne sisselogimine (SSO)',
						description:
							'Üks kasutajanimi ja parool paneeli, meili ja ettevõtte saidi kabineti jaoks. Logid sisse ühte teenusesse — oled automaatselt sisse logitud ka teistesse, parooli uuesti sisestamata. Juurdepääs igale teenusele lülitatakse sisse iga töötaja kohta eraldi.',
					},
				],
			},
			{
				category: 'Süsteem',
				items: [
					{ title: 'Auditilogi', description: 'Kes, mida ja millal paneelis muutis.' },
					{ title: 'Teavitused', description: 'Kelluke sündmustega (uued piletid, ligipääsu andmine jms).' },
					{ title: 'OAuth2/OIDC', description: 'Oma projekte saab ühendada klientidena, autentides Kursori kaudu.' },
					{ title: 'API-võtmed', description: 'Väliste integratsioonide jaoks, seotud konkreetse projektiga.' },
					{
						title: 'Paneeli peenhäälestus',
						description: 'Oma domeen paneelile, pordi muutmine, IP-aadresside valge nimekiri, kaitse parooli äraarvamise eest (lukustus pärast ebaõnnestunud katseid).',
					},
				],
			},
		],
		roadmapTitle: 'Mis tuleb veel',
		roadmapNearTitle: 'Lähiajal',
		roadmapNear: [
			{ title: 'Kaheastmeline autentimine (2FA)', description: 'Lisakood sisselogimisel — pole veel realiseeritud.' },
			{
				title: 'Saidi päringute integreerimine Service Deski',
				description: 'Tehniline päring saidi vormist läheb kohe piletina sisemisse klienditoesse, nupuga "suuna arendajale".',
			},
			{
				title: 'Paneeli enda turvalisuse tugevdamine',
				description: 'Otsese IP:port juurdepääsu sulgemine väljastpoolt (jätta ainult oma domeen HTTPS-iga), sessioooniküpsise kohustuslik krüpteerimine.',
			},
		],
		roadmapLongTitle: 'Pikas perspektiivis',
		roadmapLong: [
			{ title: 'Ühekordse sisselogimise laiendamine', description: 'Automaatselt kõigile uutele sisemistele teenustele, sama põhimõtte alusel.' },
			{
				title: 'Ühekordne sisselogimine tööarvutitesse',
				description: 'Tulevikuambitsioon — sama ühine kasutajanimi/parool ka töötajate tööarvutitesse sisselogimiseks (mitte ainult veebiteenustesse), eraldi ja rangema autentimisprotokolliga.',
			},
		],
		ctaText: 'Sama mootorit, sama infrastruktuuri distsipliini saan üles seada ka teie projektile.',
		ctaButton: 'Arutame projekti',
	},
};

export function getKursorContent(lang: KursorLang): KursorContent {
	return content[lang];
}
