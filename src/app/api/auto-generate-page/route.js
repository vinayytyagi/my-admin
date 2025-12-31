import { NextResponse } from 'next/server';
import { generatePageData } from '@/app/(root)/services/_data/pageTemplates';

/**
 * Generate complete page content WITHOUT OpenAI
 * Uses pre-written templates with city placeholder replacement
 */
export async function POST(request) {
  try {
    const { service, city, templateId } = await request.json();

    if (!city) {
      return NextResponse.json(
        { error: 'Missing required field: city' },
        { status: 400 }
      );
    }

    // Use templateId if provided, otherwise try to extract from service name
    const finalTemplateId = templateId || 'mobile-app';
    
    // Generate page data using pre-written templates
    const pageData = generatePageData(finalTemplateId, city);

    return NextResponse.json({
      success: true,
      pageData,
      message: `Generated complete page for ${service || finalTemplateId} in ${city}`,
      method: 'pre-written-templates', // No AI used
    });

  } catch (error) {
    console.error('[Auto Generate Page Error]', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate page' },
      { status: 500 }
    );
  }
}
