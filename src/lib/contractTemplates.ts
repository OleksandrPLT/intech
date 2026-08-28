/**
 * Service-agreement contract templates — three jurisdiction versions,
 * each in its own language (this is a 1:1 mapping, not 3 languages × 3
 * jurisdictions): Ukraine (uk), Estonia (et), and a generic International
 * version (en) for clients outside either. Rendered on
 * /app/admin/projects/[id]/contract.astro, filled in from the project's
 * client profile and editable there before printing.
 *
 * These are standard freelance/agency service-agreement templates, not
 * legal advice — the README flags that a lawyer in the relevant
 * jurisdiction should review the wording before it's used to sign real
 * contracts, same caution as the Estonian site copy elsewhere.
 */

export interface ContractData {
	contractNumber: string;
	date: string;
	place: string;
	executorName: string;
	executorDetails: string;
	executorEmail: string;
	payerName: string;
	payerDetails: string;
	payerEmail: string;
	subject: string;
	amount: string;
	currency: string;
}

export interface ContractSection {
	heading: string;
	paragraphs: string[];
}

export interface ContractTemplate {
	docTitle: string;
	partiesIntro: string;
	sections: ContractSection[];
	signature: { executorLabel: string; payerLabel: string; nameLabel: string; dateLabel: string };
}

export type ContractVersion = 'uk' | 'en' | 'et';

export const contractVersionLabels: Record<ContractVersion, string> = {
	uk: 'Україна',
	et: 'Естонія',
	en: 'Міжнародний',
};

export function contractTemplate(version: ContractVersion, d: ContractData): ContractTemplate {
	if (version === 'uk') return ukraineTemplate(d);
	if (version === 'et') return estoniaTemplate(d);
	return internationalTemplate(d);
}

function ukraineTemplate(d: ContractData): ContractTemplate {
	return {
		docTitle: `ДОГОВІР № ${d.contractNumber} про надання послуг з розробки програмного забезпечення`,
		partiesIntro: `${d.place}, ${d.date}. ${d.executorName} (далі — «Виконавець»), з однієї сторони, та ${d.payerName} (далі — «Замовник»), з іншої сторони, разом — «Сторони», уклали цей договір (далі — «Договір») про таке:`,
		sections: [
			{
				heading: '1. Предмет договору',
				paragraphs: [
					`1.1. Виконавець зобов'язується надати Замовнику послуги з розробки, налаштування та/або супроводу програмного забезпечення (далі — «Послуги»), а Замовник — прийняти та оплатити ці Послуги на умовах цього Договору.`,
					`1.2. Опис Послуг: ${d.subject}`,
				],
			},
			{
				heading: '2. Вартість послуг та порядок розрахунків',
				paragraphs: [
					`2.1. Вартість Послуг за цим Договором становить ${d.amount} ${d.currency}.`,
					`2.2. Оплата здійснюється Замовником шляхом безготівкового переказу коштів на рахунок Виконавця протягом строку, вказаного у виставленому рахунку.`,
					`2.3. Датою оплати вважається дата зарахування коштів на рахунок Виконавця.`,
				],
			},
			{
				heading: '3. Права та обов\'язки Сторін',
				paragraphs: [
					`3.1. Виконавець зобов'язується надати Послуги якісно та у строки, погоджені Сторонами додатково (у листуванні, технічному завданні або додатку до цього Договору).`,
					`3.2. Замовник зобов'язується своєчасно надавати Виконавцю інформацію, матеріали та доступи, необхідні для надання Послуг, а також своєчасно приймати й оплачувати виконані роботи.`,
					`3.3. Виконавець має право залучати third-party підрядників для виконання окремих робіт, залишаючись відповідальним перед Замовником за результат.`,
				],
			},
			{
				heading: '4. Відповідальність Сторін',
				paragraphs: [
					`4.1. За невиконання або неналежне виконання зобов'язань за цим Договором Сторони несуть відповідальність згідно з чинним законодавством України.`,
					`4.2. Виконавець не несе відповідальності за затримки, спричинені несвоєчасним наданням Замовником необхідної інформації, матеріалів чи доступів.`,
				],
			},
			{
				heading: '5. Конфіденційність',
				paragraphs: [
					`5.1. Сторони зобов'язуються не розголошувати третім особам конфіденційну інформацію, отриману в рамках виконання цього Договору, без письмової згоди іншої Сторони, крім випадків, передбачених законодавством.`,
				],
			},
			{
				heading: '6. Форс-мажор',
				paragraphs: [
					`6.1. Сторони звільняються від відповідальності за часткове або повне невиконання зобов'язань за цим Договором, якщо це невиконання стало наслідком обставин непереборної сили (форс-мажору), які виникли після укладення Договору.`,
				],
			},
			{
				heading: '7. Строк дії та розірвання Договору',
				paragraphs: [
					`7.1. Договір набирає чинності з дати його підписання Сторонами і діє до повного виконання Сторонами своїх зобов'язань.`,
					`7.2. Договір може бути розірваний за взаємною згодою Сторін або в односторонньому порядку з письмовим повідомленням іншої Сторони за 10 календарних днів.`,
				],
			},
			{
				heading: '8. Вирішення спорів та застосовне право',
				paragraphs: [
					`8.1. Усі спори, що виникають із цього Договору, вирішуються шляхом переговорів. У разі недосягнення згоди — відповідно до чинного законодавства України, у судовому порядку за місцезнаходженням Виконавця.`,
					`8.2. Цей Договір регулюється та тлумачиться відповідно до законодавства України.`,
				],
			},
			{
				heading: '9. Прикінцеві положення',
				paragraphs: [
					`9.1. Цей Договір складено у двох примірниках, що мають однакову юридичну силу, по одному для кожної із Сторін.`,
					`9.2. Усі зміни та доповнення до цього Договору дійсні лише в письмовій формі за підписом обох Сторін.`,
				],
			},
		],
		signature: { executorLabel: 'Виконавець', payerLabel: 'Замовник', nameLabel: "П.І.Б. / Підпис", dateLabel: 'Дата' },
	};
}

function estoniaTemplate(d: ContractData): ContractTemplate {
	return {
		docTitle: `TEENUSE OSUTAMISE LEPING nr ${d.contractNumber}`,
		partiesIntro: `${d.place}, ${d.date}. ${d.executorName} (edaspidi „Teenuse osutaja") ühelt poolt ja ${d.payerName} (edaspidi „Klient") teiselt poolt, edaspidi koos „Pooled", sõlmisid käesoleva lepingu (edaspidi „Leping") alljärgnevas:`,
		sections: [
			{
				heading: '1. Lepingu ese',
				paragraphs: [
					`1.1. Teenuse osutaja kohustub osutama Kliendile tarkvara arendus-, seadistus- ja/või hooldusteenuseid (edaspidi „Teenused") ning Klient kohustub Teenused vastu võtma ja nende eest tasuma vastavalt käesoleva Lepingu tingimustele.`,
					`1.2. Teenuste kirjeldus: ${d.subject}`,
				],
			},
			{
				heading: '2. Teenuste hind ja maksetingimused',
				paragraphs: [
					`2.1. Teenuste hind käesoleva Lepingu alusel on ${d.amount} ${d.currency}.`,
					`2.2. Klient tasub arve alusel pangaülekandega arvel märgitud tähtaja jooksul.`,
					`2.3. Maksekuupäevaks loetakse kuupäev, mil raha laekub Teenuse osutaja arvelduskontole.`,
				],
			},
			{
				heading: '3. Poolte õigused ja kohustused',
				paragraphs: [
					`3.1. Teenuse osutaja kohustub osutama Teenuseid kvaliteetselt ja Poolte vahel kokkulepitud tähtaegadel (kirjavahetuses, lähteülesandes või käesoleva Lepingu lisas).`,
					`3.2. Klient kohustub andma Teenuse osutajale õigeaegselt vajaliku info, materjalid ja juurdepääsud ning teostatud tööd õigeaegselt vastu võtma ja nende eest tasuma.`,
					`3.3. Teenuse osutajal on õigus kaasata üksikute tööde teostamiseks kolmandaid isikuid, jäädes ise Kliendi ees tulemuse eest vastutavaks.`,
				],
			},
			{
				heading: '4. Poolte vastutus',
				paragraphs: [
					`4.1. Käesolevast Lepingust tulenevate kohustuste täitmata jätmise või mittenõuetekohase täitmise eest vastutavad Pooled vastavalt Eesti Vabariigi seadusandlusele.`,
					`4.2. Teenuse osutaja ei vastuta viivituste eest, mis on tingitud Kliendi poolt vajaliku info, materjalide või juurdepääsude hilinenud esitamisest.`,
				],
			},
			{
				heading: '5. Konfidentsiaalsus',
				paragraphs: [
					`5.1. Pooled kohustuvad mitte avaldama kolmandatele isikutele käesoleva Lepingu täitmise käigus saadud konfidentsiaalset infot ilma teise Poole kirjaliku nõusolekuta, välja arvatud seaduses ettenähtud juhtudel.`,
				],
			},
			{
				heading: '6. Vääramatu jõud',
				paragraphs: [
					`6.1. Pooled vabanevad vastutusest käesoleva Lepingu osalise või täieliku mittetäitmise eest, kui see on tingitud vääramatu jõu asjaoludest, mis tekkisid pärast Lepingu sõlmimist.`,
				],
			},
			{
				heading: '7. Lepingu kehtivus ja lõpetamine',
				paragraphs: [
					`7.1. Leping jõustub Poolte allkirjastamise kuupäeval ja kehtib kuni Poolte kohustuste täieliku täitmiseni.`,
					`7.2. Lepingu võib lõpetada Poolte kokkuleppel või ühepoolselt, teatades sellest teisele Poolele kirjalikult 10 kalendripäeva ette.`,
				],
			},
			{
				heading: '8. Vaidluste lahendamine ja kohaldatav õigus',
				paragraphs: [
					`8.1. Kõik käesolevast Lepingust tulenevad vaidlused lahendatakse läbirääkimiste teel. Kokkuleppe mittesaavutamisel — vastavalt Eesti Vabariigi seadusandlusele, kohtus Teenuse osutaja asukoha järgi.`,
					`8.2. Käesolevale Lepingule kohaldatakse ja seda tõlgendatakse Eesti Vabariigi õiguse kohaselt.`,
				],
			},
			{
				heading: '9. Lõppsätted',
				paragraphs: [
					`9.1. Käesolev Leping on koostatud kahes võrdset juriidilist jõudu omavas eksemplaris, üks kummalegi Poolele.`,
					`9.2. Kõik käesoleva Lepingu muudatused ja täiendused kehtivad ainult kirjalikus vormis ja mõlema Poole allkirjaga.`,
				],
			},
		],
		signature: { executorLabel: 'Teenuse osutaja', payerLabel: 'Klient', nameLabel: 'Nimi / Allkiri', dateLabel: 'Kuupäev' },
	};
}

function internationalTemplate(d: ContractData): ContractTemplate {
	return {
		docTitle: `SERVICE AGREEMENT No. ${d.contractNumber}`,
		partiesIntro: `${d.place}, ${d.date}. This Service Agreement (the "Agreement") is entered into between ${d.executorName} (the "Provider") and ${d.payerName} (the "Client"), together referred to as the "Parties", as follows:`,
		sections: [
			{
				heading: '1. Subject of the Agreement',
				paragraphs: [
					`1.1. The Provider agrees to render software development, configuration, and/or support services (the "Services") to the Client, and the Client agrees to accept and pay for such Services under the terms of this Agreement.`,
					`1.2. Description of Services: ${d.subject}`,
				],
			},
			{
				heading: '2. Fees and Payment Terms',
				paragraphs: [
					`2.1. The fee for the Services under this Agreement is ${d.amount} ${d.currency}.`,
					`2.2. The Client shall pay by bank transfer within the period specified on the issued invoice.`,
					`2.3. Payment is deemed made on the date the funds are credited to the Provider's account.`,
				],
			},
			{
				heading: '3. Rights and Obligations of the Parties',
				paragraphs: [
					`3.1. The Provider shall render the Services with due care and within the timelines agreed by the Parties separately (in correspondence, a technical brief, or an annex to this Agreement).`,
					`3.2. The Client shall provide the Provider, in a timely manner, with the information, materials, and access necessary to render the Services, and shall accept and pay for completed work in a timely manner.`,
					`3.3. The Provider may engage third-party contractors for specific tasks while remaining responsible to the Client for the result.`,
				],
			},
			{
				heading: '4. Liability of the Parties',
				paragraphs: [
					`4.1. A Party failing to perform or improperly performing its obligations under this Agreement shall be liable in accordance with applicable law and the terms of this Agreement.`,
					`4.2. The Provider shall not be liable for delays caused by the Client's failure to provide necessary information, materials, or access in a timely manner.`,
				],
			},
			{
				heading: '5. Confidentiality',
				paragraphs: [
					`5.1. The Parties agree not to disclose to third parties any confidential information obtained in the course of performing this Agreement without the other Party's written consent, except as required by law.`,
				],
			},
			{
				heading: '6. Force Majeure',
				paragraphs: [
					`6.1. Neither Party shall be liable for partial or complete failure to perform its obligations under this Agreement if such failure results from force majeure circumstances arising after the conclusion of this Agreement.`,
				],
			},
			{
				heading: '7. Term and Termination',
				paragraphs: [
					`7.1. This Agreement takes effect on the date of signing by the Parties and remains in force until the Parties have fully performed their obligations.`,
					`7.2. This Agreement may be terminated by mutual agreement of the Parties, or unilaterally with 10 calendar days' written notice to the other Party.`,
				],
			},
			{
				heading: '8. Dispute Resolution and Governing Law',
				paragraphs: [
					`8.1. Any disputes arising from this Agreement shall be resolved through negotiation between the Parties. Failing agreement, either Party may pursue resolution through the courts having jurisdiction over the Provider's place of business, unless the Parties agree otherwise in writing.`,
					`8.2. Unless otherwise agreed in writing by the Parties, this Agreement is governed by the law of the country in which the Provider is registered at the time of signing.`,
				],
			},
			{
				heading: '9. Final Provisions',
				paragraphs: [
					`9.1. This Agreement is executed in two counterparts of equal legal force, one for each Party.`,
					`9.2. Any amendments or additions to this Agreement are valid only in writing and signed by both Parties.`,
				],
			},
		],
		signature: { executorLabel: 'Provider', payerLabel: 'Client', nameLabel: 'Name / Signature', dateLabel: 'Date' },
	};
}
