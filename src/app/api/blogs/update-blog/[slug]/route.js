import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, updateDoc, Timestamp } from "firebase/firestore";
import { generateSlug } from "@/util/generateSlug";

export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
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

    const blogQuery = query(collection(db, "xenotix_blogs"), where("slug", "==", slug));
    const blogSnapshot = await getDocs(blogQuery);

    if (blogSnapshot.empty) {
      return NextResponse.json(
        { error: "Blog with provided slug not found" },
        { status: 404 }
      );
    }

    const blogDoc = blogSnapshot.docs[0];

    const updatedBlogData = {
      title: data.title.trim(),
      description: data.description.trim(),
      slug: generateSlug(data.title.trim()),
      content: data.content,
      author: data.author,
      seo: {
        title: data.seoTitle || data.title.trim(),
        description: data.seoDescription || data.description.trim(),
        keywords: data.keywords
          ? data.keywords.split(",").map((k) => k.trim())
          : [],
        ogImageUrl: data.ogImageUrl || data.imageUrl,
        imageTitle: data.imageTitle || "",
        altText: data.altText || "",
        author: data.author || "",
        metaRobots: data.metaRobots || "index, follow",
      },
      imageUrl: data.imageUrl,
      category: data.category,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      status: data.status === "active" ? "active" : "inactive",
      updatedAt: Timestamp.now(),
      createdBy: data.createdBy || null,
    };

    await updateDoc(blogDoc.ref, updatedBlogData);

    return NextResponse.json(
      {
        success: true,
        blogId: blogDoc.id,
        slug: slug,
        seo: updatedBlogData.seo,
        message: "Blog updated successfully with SEO optimization",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      {
        error: "Failed to update blog",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
