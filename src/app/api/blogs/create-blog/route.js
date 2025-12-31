import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { generateSlug } from "@/util/generateSlug";

export async function POST(request) {
  try {
    const data = await request.json();

    const requiredFields = ["title", "description", "content"];
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
    const slug = generateSlug(data.title.trim());

    const blogData = {
      title: data.title.trim(),
      description: data.description.trim(),
      content: data.content,
      author: data.author,
      seo: {
        title: data.seoTitle || data.title.trim(),
        description: data.seoDescription || data.description.trim(),
        keywords: data.keywords
          ? data.keywords.split(",").map((k) => k.trim())
          : [],
        ogImageUrl: data.ogImageUrl,
        imageTitle: data.imageTitle || "",
        altText: data.altText || "",
        author: data.author || "",
        metaRobots: data.metaRobots || "index, follow",
      },
      imageUrl: data.imageUrl,
      category: data.category,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      status: data.status === "active" ? "active" : "inactive",
      viewCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: data.createdBy || null,
      slug: slug,
    };

    const cleanedSeo = {
      ...blogData.seo,
      ogImageUrl: blogData.seo?.ogImageUrl || blogData.imageUrl,
    };

    const cleanedBlogData = {
      ...blogData,
      seo: cleanedSeo,
    };

    const docRef = await addDoc(collection(db, "xenotix_blogs"), cleanedBlogData);

    return NextResponse.json(
      {
        success: true,
        blogId: docRef.id,
        slug: slug,
        seo: blogData.seo,
        message: "Blog created successfully with SEO optimization",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      {
        error: "Failed to create blog",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}