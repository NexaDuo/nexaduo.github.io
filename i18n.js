/**
 * NexaDuo Website - Internationalization (EN + PT-BR)
 *
 * Pure client-side, no build step, no external library. Inline dictionaries.
 * Shared by index.html, privacy-policy/ and terms-of-service/.
 *
 * Conventions used in the HTML:
 *   - data-i18n="key"                     -> replaces the element content.
 *                                            <title> uses textContent; every
 *                                            other element uses innerHTML so a
 *                                            translation may contain trusted
 *                                            inline markup (spans, <strong>,
 *                                            <a>). Values are authored here,
 *                                            never user input.
 *   - data-i18n-attr="attr:key;attr2:key" -> sets one or more attributes
 *                                            (content, aria-label, alt,
 *                                            placeholder, ...) to translations.
 *
 * Detection order (see resolveLang):
 *   1. localStorage manual choice (highest priority).
 *   2. navigator.language: pt* -> pt-BR, en* -> en, anything else -> pt-BR.
 *
 * <html lang> is resolved as early as possible by a tiny inline script in the
 * <head> of each page; this file re-applies it together with the text swap.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'nexaduo-lang';
    var SUPPORTED = ['pt', 'en'];
    var HTML_LANG = { pt: 'pt-BR', en: 'en' };

    var DICT = {
        pt: {
            // Shared: navigation, footer, language selector
            'lang.aria': 'Selecionar idioma',
            'skip': 'Pular para o conteúdo',
            'nav.home': 'Início',
            'nav.services': 'Serviços',
            'nav.contact': 'Contato',
            'nav.cta': 'Fale Conosco',
            'footer.tagline': 'Transformando ideias em soluções tecnológicas inovadoras.',
            'footer.links': 'Links',
            'footer.privacy': 'Política de Privacidade',
            'footer.terms': 'Termos de Uso',
            'footer.contact_title': 'Contato',
            'footer.copyright': '&copy; 2026 NexaDuo. Todos os direitos reservados.',

            // Home - meta
            'meta.title': 'NexaDuo - Soluções Tecnológicas Inovadoras',
            'meta.description': 'NexaDuo - Empresa especializada em desenvolvimento de software, consultoria tecnológica e soluções digitais inovadoras.',
            'og.description': 'Desenvolvemos software personalizado e oferecemos consultoria tecnológica para impulsionar o crescimento do seu negócio.',

            // Home - hero
            'hero.badge': 'Inovação &amp; Tecnologia',
            'hero.title': 'Transformamos <span class="gradient-text">ideias</span> em <span class="gradient-text">soluções tecnológicas</span>',
            'hero.desc': 'Desenvolvemos software personalizado e oferecemos consultoria tecnológica para impulsionar o crescimento do seu negócio no mundo digital.',
            'hero.cta_secondary': 'Nossos Serviços',

            // Home - code window
            'code.mission_key': 'missão',
            'code.mission_val': '"inovar"',
            'code.services_key': 'serviços',
            'code.svc1': '"Consultoria Tecnológica"',
            'code.svc2': '"Dados &amp; Analytics"',
            'code.transform': 'transformar',
            'code.param': 'ideia',
            'code.solution': 'solução',
            'code.create': 'criar',

            // Home - services
            'services.tag': 'Serviços',
            'services.title': 'Soluções completas para o seu negócio',
            'services.desc': 'Combinamos expertise técnica com visão estratégica para entregar resultados que fazem a diferença.',
            'service1.title': 'Consultoria Tecnológica',
            'service1.desc': 'Orientamos sua empresa na escolha das melhores tecnologias e estratégias digitais.',
            'service1.item1': 'Análise de Arquitetura',
            'service1.item2': 'Auditoria de Código',
            'service1.item3': 'Planejamento Estratégico',
            'service1.item4': 'Otimização de Performance',
            'service2.title': 'Dados &amp; Analytics',
            'service2.desc': 'Transformamos seus dados em insights valiosos através de dashboards e análises avançadas.',

            // Home - contact
            'contact.tag': 'Contato',
            'contact.title': 'Vamos conversar sobre seu projeto',
            'contact.desc': 'Estamos prontos para ajudar você a transformar suas ideias em realidade.',
            'contact.team_title': 'Nossa Equipe',
            'contact.info_title': 'Informações',
            'contact.location': 'Porto Alegre, RS - Brasil',

            // Legal (shared bits)
            'legal.tag': 'Legal',
            'legal.updated': 'Última atualização: junho de 2026',
            'legal.li_email': '<strong>E-mail:</strong> <a href="mailto:contato@nexaduo.com">contato@nexaduo.com</a>',
            'legal.li_company': '<strong>Empresa:</strong> NexaDuo — CNPJ 29.667.108/0001-14',
            'legal.li_address': '<strong>Endereço:</strong> Porto Alegre, RS — Brasil',

            // Privacy Policy
            'privacy.meta_title': 'Política de Privacidade - NexaDuo',
            'privacy.meta_description': 'Política de Privacidade da NexaDuo. Saiba como coletamos, usamos e protegemos suas informações.',
            'privacy.h1': 'Política de Privacidade',
            'privacy.intro': 'A NexaDuo ("nós", "nosso") está comprometida com a proteção da sua privacidade. Esta política descreve como coletamos, usamos e protegemos as informações obtidas por meio do nosso site <strong>nexaduo.com</strong>.',
            'privacy.h2_1': '1. Informações que coletamos',
            'privacy.p_1': 'Coletamos informações que você nos fornece diretamente, como nome e e-mail ao entrar em contato, e informações coletadas automaticamente, como dados de navegação, endereço IP e tipo de dispositivo.',
            'privacy.h2_2': '2. Uso das informações',
            'privacy.p_2': 'Utilizamos suas informações para:',
            'privacy.li_2_1': 'Responder às suas solicitações e fornecer nossos serviços;',
            'privacy.li_2_2': 'Melhorar a experiência de navegação no site;',
            'privacy.li_2_3': 'Enviar comunicações relacionadas aos serviços contratados;',
            'privacy.li_2_4': 'Cumprir obrigações legais e regulatórias.',
            'privacy.h2_3': '3. Compartilhamento de informações',
            'privacy.p_3': 'Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais. Podemos compartilhar informações com prestadores de serviços tecnológicos estritamente necessários para a operação do site e dos nossos serviços, mediante acordos de confidencialidade.',
            'privacy.h2_4': '4. Serviços de terceiros',
            'privacy.p_4': 'Nosso site utiliza ferramentas de terceiros para análise e infraestrutura, incluindo serviços da <strong>Google LLC</strong> (Google Cloud, Google Fonts e Google Analytics). O uso dessas ferramentas é regido pelas respectivas políticas de privacidade do Google, disponíveis em <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.',
            'privacy.h2_5': '5. Cookies',
            'privacy.p_5': 'Utilizamos cookies e tecnologias semelhantes para melhorar a navegação e analisar o uso do site. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades do site.',
            'privacy.h2_6': '6. Seus direitos (LGPD)',
            'privacy.p_6': 'Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:',
            'privacy.li_6_1': 'Confirmar a existência de tratamento de seus dados;',
            'privacy.li_6_2': 'Acessar, corrigir ou excluir seus dados;',
            'privacy.li_6_3': 'Solicitar a portabilidade de seus dados;',
            'privacy.li_6_4': 'Revogar o consentimento previamente concedido.',
            'privacy.p_6b': 'Para exercer qualquer um desses direitos, entre em contato pelo e-mail <a href="mailto:contato@nexaduo.com">contato@nexaduo.com</a>.',
            'privacy.h2_7': '7. Segurança',
            'privacy.p_7': 'Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda ou destruição.',
            'privacy.h2_8': '8. Retenção de dados',
            'privacy.p_8': 'Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei.',
            'privacy.h2_9': '9. Alterações nesta política',
            'privacy.p_9': 'Podemos atualizar esta política periodicamente. A data de "última atualização" no topo desta página indica quando ocorreu a revisão mais recente.',
            'privacy.h2_10': '10. Contato',
            'privacy.p_10': 'Em caso de dúvidas sobre esta política, entre em contato:',

            // Terms of Service
            'terms.meta_title': 'Termos de Uso - NexaDuo',
            'terms.meta_description': 'Termos de Uso da NexaDuo. Leia as condições que regem o uso do nosso site e serviços.',
            'terms.h1': 'Termos de Uso',
            'terms.intro': 'Ao acessar e utilizar o site <strong>nexaduo.com</strong>, você concorda com os presentes Termos de Uso. Se não concordar com qualquer disposição, por favor, não utilize o site.',
            'terms.h2_1': '1. Sobre a NexaDuo',
            'terms.p_1': 'A NexaDuo é uma empresa brasileira de tecnologia (CNPJ 29.667.108/0001-14), sediada em Porto Alegre, RS, especializada em consultoria tecnológica, desenvolvimento de software e soluções de dados e analytics.',
            'terms.h2_2': '2. Uso do site',
            'terms.p_2': 'O site nexaduo.com tem caráter informativo e institucional. Você se compromete a utilizá-lo somente para fins lícitos e a não praticar atos que possam prejudicar a NexaDuo, outros usuários ou terceiros, incluindo:',
            'terms.li_2_1': 'Acesso não autorizado a sistemas ou dados;',
            'terms.li_2_2': 'Distribuição de conteúdo malicioso ou ilegal;',
            'terms.li_2_3': 'Reprodução do conteúdo sem autorização prévia e por escrito.',
            'terms.h2_3': '3. Propriedade intelectual',
            'terms.p_3': 'Todo o conteúdo disponível no site — incluindo textos, imagens, logotipos e código-fonte — é de propriedade exclusiva da NexaDuo ou de seus licenciantes, protegido pela legislação brasileira de direitos autorais (Lei nº 9.610/1998). É vedada qualquer reprodução ou uso sem autorização.',
            'terms.h2_4': '4. Serviços contratados',
            'terms.p_4': 'Os serviços prestados pela NexaDuo são regidos por contratos individuais celebrados com cada cliente. Esses contratos prevalecem sobre estes Termos de Uso no que se refere às obrigações das partes.',
            'terms.h2_5': '5. Limitação de responsabilidade',
            'terms.p_5': 'O site é fornecido "como está", sem garantias de disponibilidade ininterrupta. A NexaDuo não se responsabiliza por danos decorrentes de interrupções, erros ou uso indevido do site por terceiros.',
            'terms.h2_6': '6. Links externos',
            'terms.p_6': 'O site pode conter links para sites de terceiros. A NexaDuo não controla e não se responsabiliza pelo conteúdo ou pelas práticas de privacidade desses sites.',
            'terms.h2_7': '7. Legislação aplicável',
            'terms.p_7': 'Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de Porto Alegre, RS, para dirimir quaisquer conflitos decorrentes desta relação, com renúncia a qualquer outro, por mais privilegiado que seja.',
            'terms.h2_8': '8. Alterações nos termos',
            'terms.p_8': 'Podemos revisar estes Termos de Uso a qualquer momento. A data de "última atualização" no topo desta página indica quando ocorreu a revisão mais recente. O uso continuado do site após alterações constitui aceitação dos novos termos.',
            'terms.h2_9': '9. Contato',
            'terms.p_9': 'Para dúvidas ou solicitações relacionadas a estes Termos de Uso:'
        },
        en: {
            // Shared: navigation, footer, language selector
            'lang.aria': 'Language selector',
            'skip': 'Skip to content',
            'nav.home': 'Home',
            'nav.services': 'Services',
            'nav.contact': 'Contact',
            'nav.cta': 'Get in Touch',
            'footer.tagline': 'Turning ideas into innovative technology solutions.',
            'footer.links': 'Links',
            'footer.privacy': 'Privacy Policy',
            'footer.terms': 'Terms of Service',
            'footer.contact_title': 'Contact',
            'footer.copyright': '&copy; 2026 NexaDuo. All rights reserved.',

            // Home - meta
            'meta.title': 'NexaDuo - Innovative Technology Solutions',
            'meta.description': 'NexaDuo - A company specialized in software development, technology consulting, and innovative digital solutions.',
            'og.description': 'We develop custom software and provide technology consulting to drive your business growth.',

            // Home - hero
            'hero.badge': 'Innovation &amp; Technology',
            'hero.title': 'We turn <span class="gradient-text">ideas</span> into <span class="gradient-text">technology solutions</span>',
            'hero.desc': 'We develop custom software and provide technology consulting to drive your business growth in the digital world.',
            'hero.cta_secondary': 'Our Services',

            // Home - code window
            'code.mission_key': 'mission',
            'code.mission_val': '"innovate"',
            'code.services_key': 'services',
            'code.svc1': '"Technology Consulting"',
            'code.svc2': '"Data &amp; Analytics"',
            'code.transform': 'transform',
            'code.param': 'idea',
            'code.solution': 'solution',
            'code.create': 'create',

            // Home - services
            'services.tag': 'Services',
            'services.title': 'Complete solutions for your business',
            'services.desc': 'We combine technical expertise with strategic vision to deliver results that make a difference.',
            'service1.title': 'Technology Consulting',
            'service1.desc': 'We guide your company in choosing the best technologies and digital strategies.',
            'service1.item1': 'Architecture Analysis',
            'service1.item2': 'Code Audit',
            'service1.item3': 'Strategic Planning',
            'service1.item4': 'Performance Optimization',
            'service2.title': 'Data &amp; Analytics',
            'service2.desc': 'We turn your data into valuable insights through dashboards and advanced analytics.',

            // Home - contact
            'contact.tag': 'Contact',
            'contact.title': "Let's talk about your project",
            'contact.desc': "We're ready to help you turn your ideas into reality.",
            'contact.team_title': 'Our Team',
            'contact.info_title': 'Information',
            'contact.location': 'Porto Alegre, RS - Brazil',

            // Legal (shared bits)
            'legal.tag': 'Legal',
            'legal.updated': 'Last updated: June 2026',
            'legal.li_email': '<strong>Email:</strong> <a href="mailto:contato@nexaduo.com">contato@nexaduo.com</a>',
            'legal.li_company': '<strong>Company:</strong> NexaDuo — Tax ID (CNPJ) 29.667.108/0001-14',
            'legal.li_address': '<strong>Address:</strong> Porto Alegre, RS — Brazil',

            // Privacy Policy
            'privacy.meta_title': 'Privacy Policy - NexaDuo',
            'privacy.meta_description': 'NexaDuo Privacy Policy. Learn how we collect, use, and protect your information.',
            'privacy.h1': 'Privacy Policy',
            'privacy.intro': 'NexaDuo ("we", "our") is committed to protecting your privacy. This policy describes how we collect, use, and protect the information obtained through our website <strong>nexaduo.com</strong>.',
            'privacy.h2_1': '1. Information we collect',
            'privacy.p_1': 'We collect information you provide directly, such as name and email when contacting us, and information collected automatically, such as browsing data, IP address, and device type.',
            'privacy.h2_2': '2. Use of information',
            'privacy.p_2': 'We use your information to:',
            'privacy.li_2_1': 'Respond to your requests and provide our services;',
            'privacy.li_2_2': 'Improve the browsing experience on the site;',
            'privacy.li_2_3': 'Send communications related to contracted services;',
            'privacy.li_2_4': 'Comply with legal and regulatory obligations.',
            'privacy.h2_3': '3. Sharing of information',
            'privacy.p_3': 'We do not sell or share your personal data with third parties for commercial purposes. We may share information with technology service providers strictly necessary for the operation of the site and our services, under confidentiality agreements.',
            'privacy.h2_4': '4. Third-party services',
            'privacy.p_4': 'Our site uses third-party tools for analytics and infrastructure, including services from <strong>Google LLC</strong> (Google Cloud, Google Fonts, and Google Analytics). The use of these tools is governed by Google\'s respective privacy policies, available at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.',
            'privacy.h2_5': '5. Cookies',
            'privacy.p_5': 'We use cookies and similar technologies to improve navigation and analyze site usage. You can configure your browser to refuse cookies, but this may affect some site features.',
            'privacy.h2_6': '6. Your rights (LGPD)',
            'privacy.p_6': 'Under the Brazilian General Data Protection Law (Law No. 13,709/2018), you have the right to:',
            'privacy.li_6_1': 'Confirm the existence of processing of your data;',
            'privacy.li_6_2': 'Access, correct, or delete your data;',
            'privacy.li_6_3': 'Request the portability of your data;',
            'privacy.li_6_4': 'Revoke previously granted consent.',
            'privacy.p_6b': 'To exercise any of these rights, contact us at <a href="mailto:contato@nexaduo.com">contato@nexaduo.com</a>.',
            'privacy.h2_7': '7. Security',
            'privacy.p_7': 'We adopt appropriate technical and organizational measures to protect your data against unauthorized access, loss, or destruction.',
            'privacy.h2_8': '8. Data retention',
            'privacy.p_8': 'We retain your data only for as long as necessary to fulfill the purposes described in this policy or as required by law.',
            'privacy.h2_9': '9. Changes to this policy',
            'privacy.p_9': 'We may update this policy periodically. The "last updated" date at the top of this page indicates when the most recent revision occurred.',
            'privacy.h2_10': '10. Contact',
            'privacy.p_10': 'If you have questions about this policy, contact us:',

            // Terms of Service
            'terms.meta_title': 'Terms of Service - NexaDuo',
            'terms.meta_description': 'NexaDuo Terms of Service. Read the conditions governing the use of our site and services.',
            'terms.h1': 'Terms of Service',
            'terms.intro': 'By accessing and using the website <strong>nexaduo.com</strong>, you agree to these Terms of Service. If you do not agree with any provision, please do not use the site.',
            'terms.h2_1': '1. About NexaDuo',
            'terms.p_1': 'NexaDuo is a Brazilian technology company (Tax ID/CNPJ 29.667.108/0001-14), headquartered in Porto Alegre, RS, specialized in technology consulting, software development, and data and analytics solutions.',
            'terms.h2_2': '2. Use of the site',
            'terms.p_2': 'The nexaduo.com site is informational and institutional in nature. You agree to use it only for lawful purposes and not to engage in acts that may harm NexaDuo, other users, or third parties, including:',
            'terms.li_2_1': 'Unauthorized access to systems or data;',
            'terms.li_2_2': 'Distribution of malicious or illegal content;',
            'terms.li_2_3': 'Reproduction of content without prior written authorization.',
            'terms.h2_3': '3. Intellectual property',
            'terms.p_3': 'All content available on the site — including text, images, logos, and source code — is the exclusive property of NexaDuo or its licensors, protected by Brazilian copyright law (Law No. 9,610/1998). Any reproduction or use without authorization is prohibited.',
            'terms.h2_4': '4. Contracted services',
            'terms.p_4': 'The services provided by NexaDuo are governed by individual contracts entered into with each client. These contracts prevail over these Terms of Service regarding the obligations of the parties.',
            'terms.h2_5': '5. Limitation of liability',
            'terms.p_5': 'The site is provided "as is", without guarantees of uninterrupted availability. NexaDuo is not liable for damages arising from interruptions, errors, or misuse of the site by third parties.',
            'terms.h2_6': '6. External links',
            'terms.p_6': 'The site may contain links to third-party sites. NexaDuo does not control and is not responsible for the content or privacy practices of those sites.',
            'terms.h2_7': '7. Governing law',
            'terms.p_7': 'These Terms of Service are governed by the laws of the Federative Republic of Brazil. The courts of the District of Porto Alegre, RS, are elected to settle any disputes arising from this relationship, waiving any other, however privileged.',
            'terms.h2_8': '8. Changes to the terms',
            'terms.p_8': 'We may revise these Terms of Service at any time. The "last updated" date at the top of this page indicates when the most recent revision occurred. Continued use of the site after changes constitutes acceptance of the new terms.',
            'terms.h2_9': '9. Contact',
            'terms.p_9': 'For questions or requests related to these Terms of Service:'
        }
    };

    function resolveLang() {
        var stored = null;
        try {
            stored = localStorage.getItem(STORAGE_KEY);
        } catch (e) { /* storage blocked */ }
        if (SUPPORTED.indexOf(stored) !== -1) return stored;

        var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
        // pt* -> pt-BR ; en* -> en ; anything else -> pt-BR fallback
        return nav.indexOf('en') === 0 ? 'en' : 'pt';
    }

    function translate(lang, key) {
        var table = DICT[lang] || DICT.pt;
        if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
        if (Object.prototype.hasOwnProperty.call(DICT.pt, key)) return DICT.pt[key];
        return null;
    }

    function applyContent(lang) {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var val = translate(lang, el.getAttribute('data-i18n'));
            if (val == null) return;
            if (el.tagName === 'TITLE') {
                el.textContent = val;
            } else {
                el.innerHTML = val;
            }
        });
    }

    function applyAttributes(lang) {
        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
                var idx = pair.indexOf(':');
                if (idx === -1) return;
                var attr = pair.slice(0, idx).trim();
                var key = pair.slice(idx + 1).trim();
                if (!attr || !key) return;
                var val = translate(lang, key);
                if (val != null) el.setAttribute(attr, val);
            });
        });
    }

    function updateSwitchUI(lang) {
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            var pressed = btn.getAttribute('data-lang') === lang;
            btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
            btn.classList.toggle('active', pressed);
        });
    }

    function apply(lang) {
        applyContent(lang);
        applyAttributes(lang);
        document.documentElement.lang = HTML_LANG[lang] || HTML_LANG.pt;
        updateSwitchUI(lang);
    }

    function setLanguage(lang, persist) {
        if (SUPPORTED.indexOf(lang) === -1) lang = 'pt';
        if (persist) {
            try {
                localStorage.setItem(STORAGE_KEY, lang);
            } catch (e) { /* storage blocked */ }
        }
        apply(lang);
    }

    function wireSwitch() {
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setLanguage(btn.getAttribute('data-lang'), true);
            });
        });
    }

    function init() {
        wireSwitch();
        setLanguage(resolveLang(), false);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exposed for debugging and tests.
    window.NexaDuoI18n = { setLanguage: setLanguage, resolveLang: resolveLang };
})();
