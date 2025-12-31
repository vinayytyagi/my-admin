/**
 * Pre-written Page Templates for Service Landing Pages
 * No AI required - all content is pre-defined with {city} placeholders
 */

// Image mapping by service category
export const IMAGE_MAP = {
  // Mobile App Development
  'mobile-app': {
    hero: { topLeftImage: '/uiux/mobileApp.webp', bottomBgImage: '/ui/figma3.webp' },
    features: ['/uiux/figma1.webp', '/uiux/figma2.webp', '/uiux/figma4.webp', '/uiux/figma5.webp'],
    dataSection: '/uiux/scalable.webp',
    scaling: { bgImage: '/uiux/scalablity.webp', fgImage: '/uiux/figma6.webp' },
    testimonials: '/uiux/uiux.webp',
  },
  'flutter': {
    hero: { topLeftImage: '/uiux/figma6.webp', bottomBgImage: '/uiux/mobileApp.webp' },
    features: ['/uiux/figma3.webp', '/uiux/figma4.webp', '/uiux/figma5.webp', '/uiux/figma1.webp'],
    dataSection: '/uiux/scalable.webp',
    scaling: { bgImage: '/uiux/scalablity.webp', fgImage: '/ui/figma3.webp' },
    testimonials: '/uiux/uiux.webp',
  },
  'react-native': {
    hero: { topLeftImage: '/uiux/figma1.webp', bottomBgImage: '/uiux/mobileApp.webp' },
    features: ['/uiux/figma2.webp', '/uiux/figma6.webp', '/uiux/figma3.webp', '/uiux/figma4.webp'],
    dataSection: '/uiux/scalable.webp',
    scaling: { bgImage: '/uiux/scalablity.webp', fgImage: '/ui/figma3.webp' },
    testimonials: '/uiux/uiux.webp',
  },
  // Web Development
  'website': {
    hero: { topLeftImage: '/ui/figma2.webp', bottomBgImage: '/uiux/Ecommerce/figma1.webp' },
    features: ['/uiux/Ecommerce/figma2.webp', '/ui/figma2.webp', '/uiux/uiux.webp', '/uiux/figma1.webp'],
    dataSection: '/uiux/scalable.webp',
    scaling: { bgImage: '/uiux/scalablity.webp', fgImage: '/uiux/Ecommerce/figma2.webp' },
    testimonials: '/uiux/uiux.webp',
  },
  'ecommerce': {
    hero: { topLeftImage: '/uiux/Ecommerce/figma1.webp', bottomBgImage: '/uiux/Ecommerce/figma2.webp' },
    features: ['/ui/figma1.webp', '/uiux/figma4.webp', '/uiux/Ecommerce/figma1.webp', '/uiux/Ecommerce/figma2.webp'],
    dataSection: '/uiux/scalable.webp',
    scaling: { bgImage: '/uiux/scalablity.webp', fgImage: '/uiux/Ecommerce/figma1.webp' },
    testimonials: '/uiux/uiux.webp',
  },
  // AI Development
  'ai': {
    hero: { topLeftImage: '/ai/figma1.webp', bottomBgImage: '/ai/figma5.webp' },
    features: ['/ai/figma2.webp', '/ai/figma3.webp', '/ai/figma4.webp', '/ai/figma6.webp'],
    dataSection: '/ai/figma7.webp',
    scaling: { bgImage: '/ai/figma8.webp', fgImage: '/ai/figma5.webp' },
    testimonials: '/ai/figma1.webp',
  },
  'ai-mobile-apps': {
    hero: { topLeftImage: '/ai/figma1.webp', bottomBgImage: '/uiux/mobileApp.webp' },
    features: ['/ai/figma2.webp', '/uiux/figma2.webp', '/ai/figma4.webp', '/uiux/figma6.webp'],
    dataSection: '/ai/figma5.webp',
    scaling: { bgImage: '/uiux/scalablity.webp', fgImage: '/ai/figma3.webp' },
    testimonials: '/uiux/uiux.webp',
  },
  'ai-chatbots': {
    hero: { topLeftImage: '/ai/figma3.webp', bottomBgImage: '/ai/figma6.webp' },
    features: ['/ai/figma1.webp', '/ai/figma4.webp', '/ai/figma7.webp', '/ai/figma8.webp'],
    dataSection: '/ai/figma5.webp',
    scaling: { bgImage: '/ai/figma2.webp', fgImage: '/ai/figma6.webp' },
    testimonials: '/ai/figma1.webp',
  },
  // UI/UX Design
  'uiux': {
    hero: { topLeftImage: '/uiux/uiux.webp', bottomBgImage: '/tech-logos/figma.webp' },
    features: ['/uiux/figma4.webp', '/uiux/figma5.webp', '/uiux/Ecommerce/figma1.webp', '/uiux/mobileApp.webp'],
    dataSection: '/uiux/scalable.webp',
    scaling: { bgImage: '/uiux/scalablity.webp', fgImage: '/uiux/uiux.webp' },
    testimonials: '/uiux/uiux.webp',
  },
  'mobile-uiux': {
    hero: { topLeftImage: '/uiux/figma5.webp', bottomBgImage: '/uiux/uiux.webp' },
    features: ['/uiux/figma1.webp', '/uiux/figma2.webp', '/uiux/figma3.webp', '/uiux/figma6.webp'],
    dataSection: '/uiux/scalable.webp',
    scaling: { bgImage: '/uiux/scalablity.webp', fgImage: '/uiux/mobileApp.webp' },
    testimonials: '/uiux/uiux.webp',
  },
  // Default fallback
  'default': {
    hero: { topLeftImage: '/uiux/mobileApp.webp', bottomBgImage: '/ui/figma3.webp' },
    features: ['/uiux/figma1.webp', '/uiux/figma2.webp', '/uiux/figma3.webp', '/uiux/figma4.webp'],
    dataSection: '/uiux/scalable.webp',
    scaling: { bgImage: '/uiux/scalablity.webp', fgImage: '/uiux/scalable.webp' },
    testimonials: '/uiux/uiux.webp',
  },
};

// Get image map for a service (with fallback)
export function getImagesForService(templateId) {
  // Map template IDs to image categories
  const categoryMap = {
    'mobile-app': 'mobile-app',
    'flutter': 'flutter',
    'react-native': 'react-native',
    'website': 'website',
    'custom-software': 'website',
    'ai': 'ai',
    'ai-mobile-apps': 'ai-mobile-apps',
    'ai-chatbots': 'ai-chatbots',
    'blockchain': 'ai',
    'crypto-fintech': 'ai',
    'erp': 'website',
    'crm': 'website',
    'lms': 'website',
    'saas': 'website',
    'mvp': 'mobile-app',
    'startup-partner': 'mobile-app',
    'uiux': 'uiux',
    'mobile-uiux': 'mobile-uiux',
    'cloud': 'ai',
    'devops': 'ai',
    'digital-marketing': 'website',
    'seo': 'website',
    'ecommerce': 'ecommerce',
    'shopify': 'ecommerce',
  };
  
  const category = categoryMap[templateId] || 'default';
  return IMAGE_MAP[category] || IMAGE_MAP['default'];
}

/**
 * Content Templates by Service Type
 * All content has {city} placeholder that gets replaced
 */
export const CONTENT_TEMPLATES = {
  'react-native': {
    seo: {
      title: 'React Native App Development Company in {city} | Xenotix',
      description: 'Top React Native development company in {city}. Build cross-platform iOS & Android apps with 50% faster development. Expert developers, competitive pricing. Get free quote!',
      keywords: ['React Native development', 'React Native company {city}', 'cross-platform app development', 'iOS Android app {city}', 'mobile app development', 'React Native developers India', 'app development company {city}', 'hybrid app development'],
    },
    hero: {
      leftBadgeText: '🚀 500+ Apps Delivered',
      headline: 'Expert React Native App Development in {city}',
      subheadline: 'Build stunning cross-platform mobile apps that work flawlessly on both iOS and Android. Our React Native experts in {city} deliver 50% faster development with native-like performance.',
      ctaLabel: 'Get Free Consultation',
      statTitle: '50%',
      statSubtitle: 'Faster Development',
      statNote: 'Compared to separate iOS & Android development',
      reviewSource: 'Clutch.co',
      reviewCount: '50+ Reviews',
      bottomOverlayText: 'One codebase. Two platforms. Infinite possibilities.',
    },
    features: {
      heading: 'Why Choose Xenotix for React Native?',
      subheading: 'We combine cross-platform efficiency with native-like performance.',
      supportTitle: 'Hello 👋 I\'m Rahul from {city}!',
      supportSubtitle: 'Let me help you build your dream app. Chat with us!',
      supportButtonLabel: 'Chat Now',
      items: [
        { title: 'Cross-Platform Excellence', description: 'Single codebase for iOS & Android. Save 50% development time and cost without compromising quality.' },
        { title: 'Native-Like Performance', description: 'Apps that feel native with smooth 60fps animations, instant responses, and seamless user experience.' },
        { title: 'Hot Reload Development', description: 'See changes instantly during development. Faster iterations mean quicker time-to-market for your app.' },
        { title: 'Cost-Effective Solution', description: 'One team, one codebase, two platforms. Reduce your development and maintenance costs by half.' },
      ],
    },
    dataSection: {
      titleLine1: 'Trusted by Businesses',
      titleLine2: 'Across {city}',
      metricValue: '500+',
      metricLabel: 'Apps Delivered',
      brands: [
        { name: 'E-commerce Giant', top: '2M+ Downloads', bottom: 'Shopping App' },
        { name: 'FinTech Startup', top: '4.8★ Rating', bottom: 'Payment App' },
        { name: 'Healthcare Platform', top: '100K+ Users', bottom: 'Patient App' },
      ],
    },
    horizontalStrip: {
      texts: ['Cross-Platform', 'Single Codebase', 'Native Performance', 'Cost Effective', 'Fast Delivery', 'Expert Team'],
    },
    scaling: {
      headingLine1: 'Ready to Build',
      headingLine2: 'Your React Native App?',
      subtext: 'From MVP to enterprise-scale apps, we help {city} businesses launch faster with React Native.',
      ctaLabel: 'Start Your Project',
      columns: [
        { title: 'Discovery Call', desc: 'Free 30-min consultation to understand your app idea and requirements.' },
        { title: 'Quick Prototype', desc: 'See your app come to life in weeks, not months. Rapid MVP development.' },
        { title: 'Launch & Scale', desc: 'From App Store submission to million users - we support your growth.' },
      ],
    },
    testimonials: {
      headerTitle: 'What {city} Clients Say',
      ctaLabel: 'View All Reviews',
      testimonials: [
        { name: 'Rajesh Kumar', title: 'Founder, TechStartup Pvt Ltd', quote: 'Xenotix delivered our React Native app in just 3 months! The cross-platform approach saved us significant time and money. Highly recommend their {city} team.' },
        { name: 'Priya Sharma', title: 'CTO, E-commerce Solutions', quote: 'Our React Native app handles 10,000+ daily users smoothly. The Xenotix team understood our vision and executed it perfectly.' },
        { name: 'Amit Verma', title: 'Product Manager, HealthTech', quote: 'From concept to App Store in 4 months. The React Native expertise at Xenotix is top-notch. Our users love the seamless experience.' },
      ],
      faqs: [
        { q: 'What is React Native app development?', a: 'React Native is a framework by Meta (Facebook) that lets us build mobile apps for both iOS and Android using a single codebase. This means faster development, lower costs, and easier maintenance.' },
        { q: 'How long does React Native app development take?', a: 'A typical React Native app takes 3-6 months depending on complexity. Simple apps can be done in 6-8 weeks, while complex apps with custom features may take 6+ months.' },
        { q: 'What is the cost of React Native development in {city}?', a: 'React Native development costs 30-50% less than building separate native apps. For {city} businesses, we offer competitive packages starting from ₹3-5 lakhs for MVPs.' },
        { q: 'Is React Native suitable for my app idea?', a: 'React Native is perfect for most apps - e-commerce, social media, healthcare, fintech, and more. For apps requiring heavy device-specific features, we might recommend native development.' },
        { q: 'Do you provide post-launch support?', a: 'Yes! We offer comprehensive maintenance packages including bug fixes, updates, performance optimization, and feature additions. Your app stays healthy long after launch.' },
      ],
    },
  },
  
  'flutter': {
    seo: {
      title: 'Flutter App Development Company in {city} | Xenotix',
      description: 'Leading Flutter development company in {city}. Build beautiful, natively compiled apps for mobile, web & desktop from a single codebase. Get free consultation!',
      keywords: ['Flutter development', 'Flutter company {city}', 'cross-platform app', 'Flutter developers', 'mobile app development', 'Flutter apps India', 'app development {city}', 'Google Flutter'],
    },
    hero: {
      leftBadgeText: '⭐ Google Certified Partner',
      headline: 'Beautiful Flutter Apps Built in {city}',
      subheadline: 'Create stunning, natively compiled applications for mobile, web, and desktop from a single codebase. Our Flutter experts deliver pixel-perfect UI with blazing fast performance.',
      ctaLabel: 'Get Free Quote',
      statTitle: '120fps',
      statSubtitle: 'Smooth Performance',
      statNote: 'Flutter\'s rendering engine delivers silky smooth animations',
      reviewSource: 'Google Reviews',
      reviewCount: '75+ Reviews',
      bottomOverlayText: 'Beautiful apps. Single codebase. Endless possibilities.',
    },
    features: {
      heading: 'Why Flutter with Xenotix?',
      subheading: 'Experience the power of Google\'s UI toolkit with our expert team.',
      supportTitle: 'Hi there! 👋 I\'m Priya.',
      supportSubtitle: 'Let\'s discuss your Flutter project. Free consultation!',
      supportButtonLabel: 'Let\'s Talk',
      items: [
        { title: 'Stunning UI Design', description: 'Flutter\'s widget system lets us create beautiful, custom UIs that stand out from the crowd.' },
        { title: 'Multi-Platform Ready', description: 'One codebase for iOS, Android, Web, and Desktop. True cross-platform development.' },
        { title: 'Fast Performance', description: 'Compiled to native ARM code. Your app runs at 60-120fps with smooth animations.' },
        { title: 'Rapid Development', description: 'Hot reload shows changes instantly. We iterate faster and deliver sooner.' },
      ],
    },
    dataSection: {
      titleLine1: 'Powering Apps',
      titleLine2: 'in {city}',
      metricValue: '300+',
      metricLabel: 'Flutter Apps',
      brands: [
        { name: 'Retail Chain', top: '500K+ Downloads', bottom: 'Shopping App' },
        { name: 'EdTech Platform', top: '4.7★ Rating', bottom: 'Learning App' },
        { name: 'Fitness Startup', top: '200K+ Users', bottom: 'Health App' },
      ],
    },
    horizontalStrip: {
      texts: ['Google Flutter', 'Custom Widgets', 'Native Performance', 'Beautiful UI', 'Fast Delivery', 'Expert Team'],
    },
    scaling: {
      headingLine1: 'Start Your Flutter',
      headingLine2: 'Journey Today',
      subtext: 'Beautiful, fast, and cross-platform. Let\'s build your Flutter app in {city}.',
      ctaLabel: 'Get Started Now',
      columns: [
        { title: 'UI/UX Design', desc: 'Custom Flutter widgets designed specifically for your brand and users.' },
        { title: 'Agile Development', desc: 'Two-week sprints with regular demos. See your app evolve in real-time.' },
        { title: 'Quality Assurance', desc: 'Rigorous testing on real devices ensures your app works flawlessly.' },
      ],
    },
    testimonials: {
      headerTitle: 'Success Stories from {city}',
      ctaLabel: 'See All Reviews',
      testimonials: [
        { name: 'Vikram Singh', title: 'CEO, RetailTech Pvt Ltd', quote: 'Our Flutter app from Xenotix handles 50,000 daily orders flawlessly. The beautiful UI keeps customers coming back!' },
        { name: 'Neha Gupta', title: 'Founder, EdTech Startup', quote: 'Xenotix built our learning app in Flutter. Works perfectly on all devices - phones, tablets, even web browsers!' },
        { name: 'Suresh Reddy', title: 'CTO, HealthTech Solutions', quote: 'The Flutter expertise at Xenotix is remarkable. Our telemedicine app runs smooth as butter on both iOS and Android.' },
      ],
      faqs: [
        { q: 'What makes Flutter different from React Native?', a: 'Flutter uses its own rendering engine (Skia) for pixel-perfect UI across platforms. It compiles to native ARM code for better performance and offers rich, customizable widgets.' },
        { q: 'How long does Flutter app development take?', a: 'Flutter development is 20-30% faster than traditional methods. Most apps take 3-5 months. Simple MVPs can be ready in 6-8 weeks.' },
        { q: 'What is the cost of Flutter development in {city}?', a: 'Flutter development saves up to 40% compared to separate native apps. Our {city} packages start from ₹4-6 lakhs for MVPs, depending on complexity.' },
        { q: 'Can Flutter apps match native app performance?', a: 'Absolutely! Flutter compiles to native ARM code. Most Flutter apps achieve 60-120fps performance, indistinguishable from fully native apps.' },
        { q: 'Do you provide Flutter web and desktop apps?', a: 'Yes! Flutter now supports web, Windows, macOS, and Linux. We can build your app for all platforms from a single codebase.' },
      ],
    },
  },
  
  'mobile-app': {
    seo: {
      title: 'Mobile App Development Company in {city} | Xenotix',
      description: 'Top mobile app development company in {city}. iOS, Android & cross-platform apps. 500+ apps delivered. Expert developers, on-time delivery. Get free consultation!',
      keywords: ['mobile app development', 'app development company {city}', 'iOS app development', 'Android app development', 'mobile app developers', 'app development India', 'custom mobile apps', 'app development services'],
    },
    hero: {
      leftBadgeText: '📱 500+ Apps Delivered',
      headline: 'Top Mobile App Development in {city}',
      subheadline: 'Transform your ideas into powerful mobile applications. From iOS to Android, native to cross-platform - we build apps that users love and businesses trust.',
      ctaLabel: 'Start Your App',
      statTitle: '4.8/5',
      statSubtitle: 'Client Rating',
      statNote: 'Based on 100+ verified client reviews',
      reviewSource: 'Clutch.co',
      reviewCount: '100+ Reviews',
      bottomOverlayText: 'From idea to App Store. We make it happen.',
    },
    features: {
      heading: 'Why Xenotix for Mobile Apps?',
      subheading: 'We build apps that drive real business results for {city} businesses.',
      supportTitle: 'Hey! 👋 I\'m Amit here.',
      supportSubtitle: 'Ready to discuss your app idea? Let\'s connect!',
      supportButtonLabel: 'Chat With Us',
      items: [
        { title: 'Native & Cross-Platform', description: 'Swift, Kotlin, React Native, Flutter - we choose the right technology for your app.' },
        { title: 'User-Centric Design', description: 'Beautiful, intuitive interfaces designed to maximize user engagement and retention.' },
        { title: 'Scalable Architecture', description: 'Apps built to handle growth - from 100 users to millions without breaking a sweat.' },
        { title: 'End-to-End Service', description: 'From ideation to App Store launch and beyond. Complete mobile app development lifecycle.' },
      ],
    },
    dataSection: {
      titleLine1: 'Trusted by',
      titleLine2: '{city} Businesses',
      metricValue: '500+',
      metricLabel: 'Apps Delivered',
      brands: [
        { name: 'Startup Unicorn', top: '10M+ Downloads', bottom: 'Consumer App' },
        { name: 'Enterprise Client', top: '99.9% Uptime', bottom: 'Business App' },
        { name: 'SMB Solution', top: '4.9★ Rating', bottom: 'Utility App' },
      ],
    },
    horizontalStrip: {
      texts: ['iOS Apps', 'Android Apps', 'Cross-Platform', 'Native Performance', 'Beautiful UI', 'Fast Delivery'],
    },
    scaling: {
      headingLine1: 'Ready to Launch',
      headingLine2: 'Your Mobile App?',
      subtext: 'Join 500+ businesses who trusted Xenotix to build their mobile apps in {city}.',
      ctaLabel: 'Get Free Consultation',
      columns: [
        { title: 'Free Consultation', desc: 'Discuss your app idea with our experts. Get a detailed roadmap and estimate.' },
        { title: 'Agile Development', desc: 'Regular updates and demos. You\'re always in the loop as your app takes shape.' },
        { title: 'Launch Support', desc: 'App Store optimization, marketing strategy, and post-launch maintenance included.' },
      ],
    },
    testimonials: {
      headerTitle: 'Client Success Stories',
      ctaLabel: 'View All Reviews',
      testimonials: [
        { name: 'Ravi Krishnan', title: 'Founder, FoodTech Startup', quote: 'Xenotix built our food delivery app from scratch. 100K downloads in first 3 months! Their {city} team really understands mobile users.' },
        { name: 'Sneha Patel', title: 'CEO, FinTech Solutions', quote: 'Our banking app handles millions in transactions daily. The Xenotix team built it secure, fast, and user-friendly.' },
        { name: 'Arjun Mehta', title: 'CPO, HealthTech Pvt Ltd', quote: 'From concept to 1 million users in a year. Xenotix didn\'t just build an app - they helped build a business.' },
      ],
      faqs: [
        { q: 'How much does mobile app development cost in {city}?', a: 'App development costs vary based on complexity. Simple apps start from ₹3-5 lakhs, medium complexity ₹5-15 lakhs, and complex enterprise apps ₹15-50 lakhs+.' },
        { q: 'How long does it take to build a mobile app?', a: 'Timeline depends on scope. MVPs take 2-3 months, standard apps 4-6 months, and complex apps 6-12 months. We provide detailed timelines during consultation.' },
        { q: 'Should I build native or cross-platform app?', a: 'For most apps, cross-platform (React Native/Flutter) is ideal - 30-40% cost savings with similar performance. Native is better for gaming or heavy device-specific features.' },
        { q: 'Do you provide app maintenance after launch?', a: 'Yes! We offer AMC packages covering bug fixes, security updates, OS compatibility, and feature additions. Maintenance costs are typically 15-20% of development cost annually.' },
        { q: 'Can you help with app marketing and ASO?', a: 'Absolutely! We provide App Store Optimization, launch marketing strategy, and user acquisition support to ensure your app gets the visibility it deserves.' },
      ],
    },
  },
};

// Fallback to mobile-app template for undefined services
export const DEFAULT_TEMPLATE = 'mobile-app';

/**
 * Generate complete page data for a service in a city
 * No AI required - uses pre-written templates
 */
export function generatePageData(templateId, cityName) {
  // Get template or use default
  const template = CONTENT_TEMPLATES[templateId] || CONTENT_TEMPLATES[DEFAULT_TEMPLATE];
  
  // Get images for this service
  const images = getImagesForService(templateId);
  
  // Helper to replace {city} in text
  const replaceCity = (text) => {
    if (typeof text === 'string') {
      return text.replace(/\{city\}/g, cityName);
    }
    if (Array.isArray(text)) {
      return text.map(item => replaceCity(item));
    }
    if (typeof text === 'object' && text !== null) {
      const result = {};
      for (const [key, value] of Object.entries(text)) {
        result[key] = replaceCity(value);
      }
      return result;
    }
    return text;
  };
  
  // Process template with city replacement
  const seo = replaceCity(template.seo);
  const hero = replaceCity(template.hero);
  const features = replaceCity(template.features);
  const dataSection = replaceCity(template.dataSection);
  const horizontalStrip = replaceCity(template.horizontalStrip);
  const scaling = replaceCity(template.scaling);
  const testimonials = replaceCity(template.testimonials);
  
  // Add images
  hero.topLeftImage = images.hero?.topLeftImage || '';
  hero.bottomBgImage = images.hero?.bottomBgImage || '';
  
  // Add images to feature items
  if (features.items) {
    features.items = features.items.map((item, idx) => ({
      ...item,
      id: `feat-${Date.now()}-${idx}`,
      frontImage: images.features?.[idx] || '',
      backgroundImage: '',
    }));
  }
  
  // Add support avatar (placeholder)
  features.supportAvatar = '/tech-logos/serviceman.png';
  
  // Data section image
  dataSection.imageSrc = images.dataSection || '';
  
  // Scaling images
  scaling.bgImage = images.scaling?.bgImage || '';
  scaling.fgImage = images.scaling?.fgImage || '';
  
  // Testimonials background
  testimonials.backgroundImage = images.testimonials || '';
  
  // Add IDs and images to testimonials
  if (testimonials.testimonials) {
    const testimonialImages = [
      '/uiux/figma1.webp',
      '/uiux/figma2.webp',
      '/uiux/figma3.webp',
    ];
    testimonials.testimonials = testimonials.testimonials.map((t, idx) => ({
      ...t,
      id: `test-${Date.now()}-${idx}`,
      image: testimonialImages[idx % testimonialImages.length],
    }));
  }
  
  // Build complete page data
  const pageData = {
    seo: {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      metaRobots: 'index, follow',
      ogImageUrl: '',
    },
    sections: [
      { id: `hero-${Date.now()}`, type: 'hero', visible: true, order: 0, props: hero },
      { id: `features-${Date.now()}`, type: 'features', visible: true, order: 1, props: features },
      { id: `dataSection-${Date.now()}`, type: 'dataSection', visible: true, order: 2, props: dataSection },
      { id: `horizontalStrip-${Date.now()}`, type: 'horizontalStrip', visible: true, order: 3, props: horizontalStrip },
      { id: `scaling-${Date.now()}`, type: 'scaling', visible: true, order: 4, props: scaling },
      { id: `customerTestimonials-${Date.now()}`, type: 'customerTestimonials', visible: true, order: 5, props: testimonials },
    ],
  };
  
  return pageData;
}
