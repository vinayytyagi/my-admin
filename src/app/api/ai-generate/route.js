import { NextResponse } from 'next/server';

/**
 * Xenotix Company Context - Fine-tuned for AI content generation
 * This context helps the AI understand the company's niche, services, and tone
 */
const XENOTIX_CONTEXT = `
You are a content writer for Xenotix Tech, a premium IT services company based in India.

**Company Profile:**
- Name: Xenotix Tech
- Tagline: "Transforming Ideas into Digital Reality"
- Services: Mobile App Development (iOS, Android, Flutter, React Native), AI/ML Development, Web Development, UI/UX Design, Blockchain/Web3, Cloud Solutions, DevOps, SaaS Development, Custom Software
- Target Clients: Startups, SMEs, and Enterprises looking for quality tech solutions
- USPs: 
  - Young, innovative team with cutting-edge technology expertise
  - Cost-effective solutions without compromising quality
  - Agile development with transparent communication
  - End-to-end product development from ideation to deployment
  - Strong focus on AI/ML integration in modern apps

**Tone & Style:**
- Professional yet approachable
- Confident without being boastful
- Focus on value and outcomes
- Use action-oriented language
- Avoid jargon, keep it understandable
- SEO-optimized with natural keyword integration

**Indian Market Context:**
- Understand local business needs
- Reference Indian success stories when relevant
- Consider tier-1, tier-2, and tier-3 city requirements
- Focus on cost-effectiveness and ROI
`;

/**
 * Section-specific prompt builders
 */
const SECTION_PROMPTS = {
  // Hero Section
  hero: {
    leftBadgeText: {
      rules: 'Generate a short badge text (max 3-4 words) that highlights a unique selling point or achievement.',
      example: 'Trusted by 500+ Businesses',
    },
    headline: {
      rules: 'Generate a powerful headline (max 10 words). Must be attention-grabbing and value-focused.',
      example: 'Transform Your Business with Cutting-Edge Mobile Apps',
    },
    subheadline: {
      rules: 'Generate a compelling subheadline (2-3 sentences). Expand on the value proposition and build trust.',
      example: 'We build scalable, high-performance mobile applications that drive growth. From startups to enterprises, we deliver solutions that matter.',
    },
    ctaLabel: {
      rules: 'Generate a CTA button text (max 4 words). Action-oriented and urgent.',
      example: 'Get Free Consultation',
    },
    statTitle: {
      rules: 'Generate a statistic title (number + brief descriptor). Must be impressive and credible.',
      example: '95% Client Satisfaction',
    },
    statSubtitle: {
      rules: 'Generate a statistic subtitle (max 5 words). Support the stat above.',
      example: 'Based on 2024 feedback',
    },
    statNote: {
      rules: 'Generate a small explanatory note for credibility (max 15 words).',
      example: 'From clients who partnered with us for at least 6 months.',
    },
    reviewSource: {
      rules: 'Generate a review source name (1-2 words). Should be credible.',
      example: 'Clutch Reviews',
    },
    reviewCount: {
      rules: 'Generate a realistic review count.',
      example: '127+ Reviews',
    },
    bottomOverlayText: {
      rules: 'Generate a conversational text snippet (max 10 words) that shows AI/tech capability.',
      example: 'Analyze Q1 sales data for growth insights',
    },
  },
  
  // Features Section
  features: {
    heading: {
      rules: 'Generate a section heading (max 6 words) that introduces features.',
      example: 'Why Choose Xenotix Tech?',
    },
    subheading: {
      rules: 'Generate a section subheading (1 sentence). Support the heading.',
      example: 'Discover how we help businesses transform through technology.',
    },
    supportTitle: {
      rules: 'Generate a friendly support chat greeting (max 10 words).',
      example: 'Hello 👋 I\'m Rahul from support.',
    },
    supportSubtitle: {
      rules: 'Generate a helpful support message (max 15 words).',
      example: 'Let me know if you have questions about our services.',
    },
    supportButtonLabel: {
      rules: 'Generate a support CTA button (max 3 words).',
      example: 'Chat Now',
    },
    'items.title': {
      rules: 'Generate a feature card title (max 4 words).',
      example: 'Agile Development',
    },
    'items.description': {
      rules: 'Generate a feature description (max 20 words). Focus on benefit.',
      example: 'Our agile methodology ensures faster delivery with continuous feedback and improvements.',
    },
  },
  
  // Data Section
  dataSection: {
    titleLine1: {
      rules: 'Generate first line of a data section title (max 5 words).',
      example: 'Trusted by Leading',
    },
    titleLine2: {
      rules: 'Generate second line of title (max 4 words). Complete the thought.',
      example: 'Brands in India',
    },
    metricValue: {
      rules: 'Generate an impressive metric value (number or percentage).',
      example: '500+',
    },
    metricLabel: {
      rules: 'Generate a metric label (max 3 words).',
      example: 'Projects Delivered',
    },
    'brands.name': {
      rules: 'Generate a realistic brand or company name.',
      example: 'TechCorp India',
    },
    'brands.top': {
      rules: 'Generate top info for brand card (metric or achievement).',
      example: '3x Revenue Growth',
    },
    'brands.bottom': {
      rules: 'Generate bottom info for brand (timeframe or category).',
      example: 'E-commerce Platform',
    },
  },
  
  // Horizontal Strip
  horizontalStrip: {
    texts: {
      rules: 'Generate a comma-separated list of 4-5 short impactful phrases (max 4 words each) for a scrolling strip.',
      example: 'Innovation First, Quality Assured, 24/7 Support, Trusted Partner, Fast Delivery',
    },
  },
  
  // Scaling Section
  scaling: {
    headingLine1: {
      rules: 'Generate first line of scaling section heading (max 4 words).',
      example: 'Ready to Scale',
    },
    headingLine2: {
      rules: 'Generate second line of heading (max 4 words).',
      example: 'Your Business?',
    },
    subtext: {
      rules: 'Generate scaling section subtext (1-2 sentences). Focus on growth.',
      example: 'Partner with us to build technology solutions that grow with your business.',
    },
    ctaLabel: {
      rules: 'Generate a CTA button text (max 4 words).',
      example: 'Start Your Project',
    },
    'columns.title': {
      rules: 'Generate a column/feature title (max 4 words).',
      example: 'Flexible Engagement',
    },
    'columns.desc': {
      rules: 'Generate a column description (max 15 words).',
      example: 'Choose from dedicated teams, fixed price, or time & material models.',
    },
  },
  
  // Customer Testimonials
  customerTestimonials: {
    headerTitle: {
      rules: 'Generate a testimonials section title (max 6 words).',
      example: 'What Our Clients Say',
    },
    ctaLabel: {
      rules: 'Generate a CTA button text (max 4 words).',
      example: 'View All Reviews',
    },
    'testimonials.name': {
      rules: 'Generate a realistic Indian business person name.',
      example: 'Priya Sharma',
    },
    'testimonials.title': {
      rules: 'Generate a job title and company (max 6 words).',
      example: 'CTO, FinTech Solutions Pvt Ltd',
    },
    'testimonials.quote': {
      rules: 'Generate a genuine-sounding testimonial quote (2-3 sentences). Focus on results and experience.',
      example: 'Xenotix transformed our vision into a stunning mobile app. Their team was responsive, professional, and delivered beyond expectations.',
    },
    'faqs.q': {
      rules: 'Generate a relevant FAQ question for this service.',
      example: 'How long does mobile app development typically take?',
    },
    'faqs.a': {
      rules: 'Generate a helpful FAQ answer (2-3 sentences). Be informative and end with a call to action.',
      example: 'Development timelines vary based on complexity, typically ranging from 3-6 months for a full-featured app. We provide detailed timelines during our free consultation.',
    },
  },
};

/**
 * Generate content using OpenAI
 */
export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { type, city, service, sectionType, fieldName, currentContent, arrayIndex } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Missing required field: type' },
        { status: 400 }
      );
    }

    let systemPrompt = XENOTIX_CONTEXT;
    let userPrompt = '';

    // Add page context
    const pageContext = `\n\n**Current Page Context:**
- Service: ${service || 'Technology Services'}
- Target City: ${city || 'India'}
- This content will appear on a local SEO landing page for Xenotix's ${service} services in ${city}.`;
    
    systemPrompt += pageContext;

    // Handle SEO fields
    if (type.startsWith('seo_')) {
      switch (type) {
        case 'seo_title':
          systemPrompt += `\n\nGenerate an SEO meta title. Rules:
- Maximum 60 characters
- Include primary keyword at the beginning
- Include city name for local SEO
- End with "| Xenotix" branding
- Return ONLY the title, nothing else`;
          userPrompt = `Generate an SEO-optimized meta title for a ${service} service page targeting ${city}, India.`;
          break;

        case 'seo_description':
          systemPrompt += `\n\nGenerate an SEO meta description. Rules:
- Between 150-160 characters
- Include primary and secondary keywords naturally
- Create urgency or curiosity with a subtle call-to-action
- Mention ${city} for local SEO
- Return ONLY the description, nothing else`;
          userPrompt = `Generate an SEO-optimized meta description for a ${service} service page targeting ${city}, India.`;
          break;

        case 'seo_keywords':
          systemPrompt += `\n\nGenerate SEO keywords. Rules:
- Return 8-12 relevant keywords
- Mix of short-tail and long-tail keywords
- Include location-based keywords with ${city}
- Return as JSON array of strings only`;
          userPrompt = `Generate SEO keywords for a ${service} service page targeting ${city}, India.`;
          break;
      }
    }
    // Handle section-specific fields
    else if (type === 'section_field' && sectionType && fieldName) {
      const sectionPrompts = SECTION_PROMPTS[sectionType];
      const fieldConfig = sectionPrompts?.[fieldName];
      
      if (!fieldConfig) {
        // Generic fallback
        systemPrompt += `\n\nGenerate content for the "${fieldName}" field in a ${sectionType} section. 
- Be concise and relevant to ${service}
- Target audience in ${city}
- Return ONLY the content, nothing else`;
        userPrompt = `Generate content for "${fieldName}" in the ${sectionType} section of a ${service} landing page for ${city}.${currentContent ? ` Improve upon: "${currentContent}"` : ''}`;
      } else {
        systemPrompt += `\n\n${fieldConfig.rules}
Example: "${fieldConfig.example}"
- Return ONLY the generated content, nothing else`;
        userPrompt = `Generate "${fieldName}" content for a ${service} landing page targeting ${city}.${arrayIndex !== undefined ? ` This is item #${arrayIndex + 1} in a list.` : ''}${currentContent ? ` Current: "${currentContent}"` : ''}`;
      }
    }
    // Handle improve existing content
    else if (type === 'improve') {
      systemPrompt += `\n\nImprove the given content. Rules:
- Maintain the original intent
- Enhance clarity, impact, and SEO
- Make it more engaging and conversion-focused
- Return ONLY the improved content`;
      userPrompt = `Improve this content for a ${service} service page: "${currentContent}"`;
    }
    else {
      return NextResponse.json(
        { error: `Unknown content type: ${type}` },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      console.error('[OpenAI Error]', error);
      return NextResponse.json(
        { error: error.error?.message || 'OpenAI API error' },
        { status: openaiResponse.status }
      );
    }

    const data = await openaiResponse.json();
    let content = data.choices?.[0]?.message?.content?.trim() || '';

    // Parse keywords if type is seo_keywords
    if (type === 'seo_keywords') {
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[0]);
        } else {
          content = content.split(/[,\n]/).map(k => k.trim().replace(/^["'-]|["'-]$/g, '')).filter(Boolean);
        }
      } catch (e) {
        content = content.split(/[,\n]/).map(k => k.trim()).filter(Boolean);
      }
    }

    return NextResponse.json({
      success: true,
      content,
      usage: data.usage,
    });

  } catch (error) {
    console.error('[AI Generate Error]', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
