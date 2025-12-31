import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { generateSlug } from "@/util/generateSlug";

export async function POST(request) {
  try {
    const data = await request.json();

    const requiredFields = ["title", "description", "image", "category"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
        },
        { status: 400 }
      );
    }

    const slug = generateSlug(data.title);

    const seo = {
      title: data.seo?.title || data.title.trim(),
      description: data.seo?.description || data.description.trim(),
      keywords: data.seo?.keywords || "",
      ogImageUrl: data.seo?.ogImageUrl || "",
      imageTitle: data.seo?.imageTitle || "",
      altText: data.seo?.altText || "",
      metaRobots: data.seo?.metaRobots || "index, follow",
    };

    let categories = {};
    if (data.categories && typeof data.categories === "object") {
      Object.keys(data.categories).forEach((catKey) => {
        const category = data.categories[catKey];
      
        categories[catKey] = {
          content: category.content || "",
          technologies: category.technologies || [],
          images: category.images,
          links: category.links || [],
          topImages: category.topImages || []
        };
      });
    }

    const portfolioData = {
      title: data.title.trim(),
      description: data.description.trim(),
      client: data.client || "",
      status: data.status || "completed",
      image: data.image,
      category: data.category,
      startDate: data.startDate ? new Date(data.startDate) : null,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
      categories,
      seo,
      slug,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      viewCount: 0,
    };

    const docRef = await addDoc(
      collection(db, "xenotix_portfolios"),
      portfolioData
    );

    return NextResponse.json(
      {
        success: true,
        portfolioId: docRef.id,
        slug,
        message: "Portfolio created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      {
        error: "Failed to create portfolio",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}