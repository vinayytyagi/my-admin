/**
 * Slug Templates for India Service Pages
 * Each template uses {city} placeholder for dynamic city name insertion
 * 
 * SEO Research Notes:
 * - Shorter slugs (3-5 words) perform better
 * - City at end is standard for local SEO
 * - Avoid stop words ("in", "and", "the") in slugs
 * - Use hyphens, lowercase only
 * - "Best/Top" works well in titles but not URLs
 */

export const SLUG_TEMPLATES = [
  // ═══════════════════════════════════════════════════════════════
  // CORE DEVELOPMENT SERVICES
  // ═══════════════════════════════════════════════════════════════
  {
    id: "mobile-app",
    label: "📱 Mobile App Development",
    category: "Core Development",
    template: "mobile-app-development-company-{city}",
    titleTemplate: "Top Mobile App Development Company in {City} | Xenotix",
    descriptionTemplate: "Leading mobile app development company in {City}. We build iOS, Android & cross-platform apps with cutting-edge technology. Get a free consultation today!",
    keywords: ["mobile app development", "iOS development", "Android development", "app development company", "mobile app developers"],
    h1Template: "Mobile App Development Company in {City}"
  },
  {
    id: "flutter-app",
    label: "🦋 Flutter App Development",
    category: "Core Development",
    template: "flutter-app-development-{city}",
    titleTemplate: "Flutter App Development Company in {City} | Xenotix",
    descriptionTemplate: "Expert Flutter app development in {City}. Build beautiful, fast cross-platform apps with single codebase for iOS & Android. Hire certified Flutter developers.",
    keywords: ["Flutter development", "Flutter app company", "cross-platform development", "Flutter developers", "Dart development"],
    h1Template: "Flutter App Development in {City}"
  },
  {
    id: "react-native",
    label: "⚛️ React Native Development",
    category: "Core Development",
    template: "react-native-development-{city}",
    titleTemplate: "React Native Development Company in {City} | Xenotix",
    descriptionTemplate: "React Native app development experts in {City}. Build high-performance cross-platform mobile apps. Scalable, cost-effective solutions for startups & enterprises.",
    keywords: ["React Native development", "React Native company", "cross-platform apps", "React Native developers", "JavaScript mobile apps"],
    h1Template: "React Native Development in {City}"
  },
  {
    id: "website-development",
    label: "🌐 Website Development",
    category: "Core Development",
    template: "website-development-company-{city}",
    titleTemplate: "Best Website Development Company in {City} | Xenotix",
    descriptionTemplate: "Professional website development company in {City}. Custom web solutions, e-commerce platforms, and high-converting corporate websites. SEO-ready & responsive.",
    keywords: ["website development", "web development company", "custom websites", "e-commerce development", "responsive web design"],
    h1Template: "Website Development Company in {City}"
  },
  {
    id: "custom-software",
    label: "⚙️ Custom Software Development",
    category: "Core Development",
    template: "custom-software-development-{city}",
    titleTemplate: "Custom Software Development Company in {City} | Xenotix",
    descriptionTemplate: "Bespoke software development in {City}. Get tailored solutions designed specifically for your unique business requirements. Scalable & future-ready architecture.",
    keywords: ["custom software development", "bespoke software", "tailored solutions", "software development company", "enterprise software"],
    h1Template: "Custom Software Development in {City}"
  },

  // ═══════════════════════════════════════════════════════════════
  // AI & EMERGING TECH
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ai-development",
    label: "🤖 AI Development",
    category: "AI & Emerging Tech",
    template: "ai-development-company-{city}",
    titleTemplate: "AI Development Company in {City} | Machine Learning Experts | Xenotix",
    descriptionTemplate: "Leading AI development company in {City}. Machine learning, NLP, computer vision, ChatGPT integration & generative AI solutions for enterprise transformation.",
    keywords: ["AI development", "machine learning", "artificial intelligence", "ML solutions", "generative AI", "ChatGPT integration"],
    h1Template: "AI Development Company in {City}"
  },
  {
    id: "ai-mobile-app",
    label: "🧠 AI Mobile App Development",
    category: "AI & Emerging Tech",
    template: "ai-mobile-app-development-{city}",
    titleTemplate: "AI-Powered Mobile App Development in {City} | Xenotix",
    descriptionTemplate: "Build intelligent AI-powered mobile apps in {City}. Smart features, predictive analytics, voice assistants & intelligent automation for next-gen applications.",
    keywords: ["AI mobile app", "intelligent app development", "smart mobile apps", "AI-powered apps", "ML mobile apps"],
    h1Template: "AI Mobile App Development in {City}"
  },
  {
    id: "chatbot-development",
    label: "💬 AI Chatbot Development",
    category: "AI & Emerging Tech",
    template: "ai-chatbot-development-{city}",
    titleTemplate: "AI Chatbot Development Company in {City} | Xenotix",
    descriptionTemplate: "Custom AI chatbot development in {City}. Build intelligent conversational AI, WhatsApp bots, customer support automation & GPT-powered virtual assistants.",
    keywords: ["AI chatbot", "chatbot development", "conversational AI", "WhatsApp bot", "virtual assistant", "customer support automation"],
    h1Template: "AI Chatbot Development in {City}"
  },

  // ═══════════════════════════════════════════════════════════════
  // BLOCKCHAIN & WEB3
  // ═══════════════════════════════════════════════════════════════
  {
    id: "blockchain-development",
    label: "⛓️ Blockchain Development",
    category: "Blockchain & Web3",
    template: "blockchain-development-company-{city}",
    titleTemplate: "Blockchain Development Company in {City} | Web3 Experts | Xenotix",
    descriptionTemplate: "Top blockchain development company in {City}. Smart contracts, DeFi, NFT platforms, dApps & Web3 solutions. Enterprise-grade blockchain integration.",
    keywords: ["blockchain development", "smart contracts", "DeFi development", "Web3", "dApps development", "NFT platform"],
    h1Template: "Blockchain Development Company in {City}"
  },
  {
    id: "crypto-app",
    label: "💰 Crypto & Fintech App",
    category: "Blockchain & Web3",
    template: "crypto-fintech-app-development-{city}",
    titleTemplate: "Crypto & Fintech App Development in {City} | Xenotix",
    descriptionTemplate: "Build secure crypto wallets, exchanges & fintech apps in {City}. Cryptocurrency platforms, payment gateways & trading applications with robust security.",
    keywords: ["crypto app development", "fintech app", "crypto wallet", "exchange development", "cryptocurrency", "payment gateway"],
    h1Template: "Crypto & Fintech App Development in {City}"
  },

  // ═══════════════════════════════════════════════════════════════
  // ENTERPRISE SOLUTIONS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "erp-development",
    label: "� ERP Development",
    category: "Enterprise Solutions",
    template: "erp-software-development-{city}",
    titleTemplate: "ERP Software Development Company in {City} | Xenotix",
    descriptionTemplate: "Custom ERP software development in {City}. Streamline operations with tailored enterprise resource planning solutions. Inventory, HR, accounting & more.",
    keywords: ["ERP development", "enterprise software", "business management", "custom ERP", "ERP solutions", "enterprise resource planning"],
    h1Template: "ERP Software Development in {City}"
  },
  {
    id: "crm-development",
    label: "👥 CRM Development",
    category: "Enterprise Solutions",
    template: "crm-software-development-{city}",
    titleTemplate: "Custom CRM Development Company in {City} | Xenotix",
    descriptionTemplate: "Build custom CRM solutions in {City}. Sales automation, lead management, customer analytics & relationship management tailored to your business workflow.",
    keywords: ["CRM development", "customer relationship management", "sales automation", "lead management", "custom CRM"],
    h1Template: "CRM Software Development in {City}"
  },
  {
    id: "lms-development",
    label: "📚 LMS Development",
    category: "Enterprise Solutions",
    template: "lms-development-company-{city}",
    titleTemplate: "LMS Development Company in {City} | Xenotix",
    descriptionTemplate: "Build custom Learning Management Systems in {City}. E-learning platforms, course management, virtual classrooms & education technology solutions.",
    keywords: ["LMS development", "learning management system", "e-learning platform", "education tech", "online course platform"],
    h1Template: "LMS Development Company in {City}"
  },
  {
    id: "saas-development",
    label: "☁️ SaaS Development",
    category: "Enterprise Solutions",
    template: "saas-development-company-{city}",
    titleTemplate: "SaaS Development Company in {City} | Xenotix",
    descriptionTemplate: "SaaS product development experts in {City}. Build scalable, cloud-native SaaS applications with multi-tenancy, subscription billing & enterprise-grade security.",
    keywords: ["SaaS development", "SaaS product", "cloud software", "subscription software", "multi-tenant applications"],
    h1Template: "SaaS Development Company in {City}"
  },

  // ═══════════════════════════════════════════════════════════════
  // STARTUP SERVICES
  // ═══════════════════════════════════════════════════════════════
  {
    id: "mvp-development",
    label: "🚀 MVP Development",
    category: "Startup Services",
    template: "mvp-development-company-{city}",
    titleTemplate: "MVP Development Company in {City} | Fast Launch | Xenotix",
    descriptionTemplate: "MVP development services in {City}. Launch your startup idea fast with minimum viable product development. Rapid prototyping, lean development & quick time-to-market.",
    keywords: ["MVP development", "minimum viable product", "startup development", "rapid prototyping", "lean startup", "product launch"],
    h1Template: "MVP Development Company in {City}"
  },
  {
    id: "startup-tech-partner",
    label: "💡 Startup Technology Partner",
    category: "Startup Services",
    template: "startup-app-development-{city}",
    titleTemplate: "Startup App Development Partner in {City} | Xenotix",
    descriptionTemplate: "Your startup technology partner in {City}. From idea validation to product launch. MVP development, scaling, and tech consulting for early-stage startups.",
    keywords: ["startup development", "tech partner", "startup app", "product development", "idea to app", "tech consulting startups"],
    h1Template: "Startup App Development in {City}"
  },

  // ═══════════════════════════════════════════════════════════════
  // DESIGN SERVICES
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ui-ux-design",
    label: "🎨 UI/UX Design",
    category: "Design Services",
    template: "ui-ux-design-agency-{city}",
    titleTemplate: "UI/UX Design Agency in {City} | Xenotix",
    descriptionTemplate: "Premier UI/UX design agency in {City}. User research, wireframing, prototyping & stunning interface design. Create delightful digital experiences that convert.",
    keywords: ["UI/UX design", "user interface design", "user experience", "design agency", "product design", "interaction design"],
    h1Template: "UI/UX Design Agency in {City}"
  },
  {
    id: "mobile-app-design",
    label: "📐 Mobile App UI Design",
    category: "Design Services",
    template: "mobile-app-ui-design-{city}",
    titleTemplate: "Mobile App UI Design Services in {City} | Xenotix",
    descriptionTemplate: "Mobile app UI/UX design specialists in {City}. iOS & Android app interfaces with intuitive navigation, beautiful aesthetics & user-centric design principles.",
    keywords: ["mobile app design", "app UI design", "mobile UX", "app interface design", "iOS app design", "Android app design"],
    h1Template: "Mobile App UI Design in {City}"
  },

  // ═══════════════════════════════════════════════════════════════
  // CLOUD & DEVOPS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "cloud-solutions",
    label: "☁️ Cloud Solutions",
    category: "Cloud & DevOps",
    template: "cloud-solutions-company-{city}",
    titleTemplate: "Cloud Solutions Company in {City} | AWS, Azure, GCP | Xenotix",
    descriptionTemplate: "Enterprise cloud solutions in {City}. AWS, Azure & Google Cloud migration, architecture, and management. Optimize costs & scale seamlessly with cloud-native infrastructure.",
    keywords: ["cloud solutions", "cloud migration", "AWS solutions", "Azure services", "Google Cloud", "cloud architecture"],
    h1Template: "Cloud Solutions Company in {City}"
  },
  {
    id: "devops-services",
    label: "🔄 DevOps Services",
    category: "Cloud & DevOps",
    template: "devops-services-{city}",
    titleTemplate: "DevOps Services Company in {City} | CI/CD Experts | Xenotix",
    descriptionTemplate: "DevOps consulting and implementation in {City}. CI/CD pipelines, infrastructure automation, containerization & cloud-native DevOps practices for faster delivery.",
    keywords: ["DevOps services", "CI/CD pipeline", "DevOps consulting", "infrastructure automation", "containerization", "Kubernetes"],
    h1Template: "DevOps Services in {City}"
  },

  // ═══════════════════════════════════════════════════════════════
  // DIGITAL MARKETING & GROWTH
  // ═══════════════════════════════════════════════════════════════
  {
    id: "digital-marketing",
    label: "📈 Digital Marketing",
    category: "Digital Marketing",
    template: "digital-marketing-agency-{city}",
    titleTemplate: "Digital Marketing Agency in {City} | Xenotix",
    descriptionTemplate: "Results-driven digital marketing agency in {City}. SEO, social media marketing, PPC, content marketing & performance campaigns that drive real business growth.",
    keywords: ["digital marketing", "SEO services", "social media marketing", "PPC advertising", "content marketing", "growth marketing"],
    h1Template: "Digital Marketing Agency in {City}"
  },
  {
    id: "seo-services",
    label: "🔍 SEO Services",
    category: "Digital Marketing",
    template: "seo-services-{city}",
    titleTemplate: "SEO Services Company in {City} | Xenotix",
    descriptionTemplate: "Expert SEO services in {City}. Technical SEO, on-page optimization, link building & local SEO strategies that boost rankings and drive organic traffic.",
    keywords: ["SEO services", "search engine optimization", "local SEO", "technical SEO", "link building", "organic traffic"],
    h1Template: "SEO Services in {City}"
  },

  // ═══════════════════════════════════════════════════════════════
  // ECOMMERCE
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ecommerce-development",
    label: "🛒 E-commerce Development",
    category: "E-commerce",
    template: "ecommerce-development-company-{city}",
    titleTemplate: "E-commerce Development Company in {City} | Xenotix",
    descriptionTemplate: "Custom e-commerce development in {City}. Shopify, WooCommerce, Magento & headless commerce solutions. Scalable online stores with seamless checkout experiences.",
    keywords: ["e-commerce development", "online store development", "Shopify development", "WooCommerce", "Magento", "headless commerce"],
    h1Template: "E-commerce Development Company in {City}"
  },
  {
    id: "shopify-development",
    label: "🛍️ Shopify Development",
    category: "E-commerce",
    template: "shopify-development-{city}",
    titleTemplate: "Shopify Development Agency in {City} | Xenotix",
    descriptionTemplate: "Shopify development experts in {City}. Custom Shopify stores, theme development, app integration & migration. Launch your e-commerce business with Shopify Plus.",
    keywords: ["Shopify development", "Shopify agency", "Shopify store", "Shopify Plus", "Shopify app development"],
    h1Template: "Shopify Development in {City}"
  }
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const getSlugTemplateById = (id) => SLUG_TEMPLATES.find(t => t.id === id);

export const getSlugTemplatesByCategory = (category) => 
  SLUG_TEMPLATES.filter(t => t.category === category);

export const getAllCategories = () => 
  [...new Set(SLUG_TEMPLATES.map(t => t.category))];

export const generateSlug = (templateId, citySlug) => {
  const template = getSlugTemplateById(templateId);
  if (!template) return null;
  return template.template.replace(/{city}/g, citySlug);
};

export const generateTitle = (templateId, cityName) => {
  const template = getSlugTemplateById(templateId);
  if (!template) return null;
  return template.titleTemplate.replace(/{City}/g, cityName);
};

export const generateDescription = (templateId, cityName) => {
  const template = getSlugTemplateById(templateId);
  if (!template) return null;
  return template.descriptionTemplate.replace(/{City}/g, cityName);
};

export const generateH1 = (templateId, cityName) => {
  const template = getSlugTemplateById(templateId);
  if (!template) return null;
  return template.h1Template.replace(/{City}/g, cityName);
};

export const generateFullPath = (districtSlug, citySlug, templateId) => {
  const slug = generateSlug(templateId, citySlug);
  return `${districtSlug}/${citySlug}/${slug}`;
};

// Generate comprehensive SEO data for a specific city and template
export const generateSeoForPage = (templateId, cityName, citySlug) => {
  const template = getSlugTemplateById(templateId);
  if (!template) return null;
  
  return {
    title: template.titleTemplate.replace(/{City}/g, cityName),
    description: template.descriptionTemplate.replace(/{City}/g, cityName),
    h1: template.h1Template.replace(/{City}/g, cityName),
    keywords: [
      ...template.keywords, 
      cityName.toLowerCase(), 
      `${template.keywords[0]} ${cityName}`,
      `${cityName} software company`,
      `IT company ${cityName}`
    ],
    slug: template.template.replace(/{city}/g, citySlug),
    category: template.category,
    metaRobots: "index, follow"
  };
};

// Get all template options formatted for dropdown
export const getTemplateOptions = () => {
  const categories = getAllCategories();
  return categories.map(category => ({
    label: category,
    options: SLUG_TEMPLATES.filter(t => t.category === category).map(t => ({
      id: t.id,
      label: t.label,
      template: t.template
    }))
  }));
};
