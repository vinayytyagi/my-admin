import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, updateDoc, Timestamp } from "firebase/firestore";
import { generateSlug } from "@/util/generateSlug";

export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const data = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Portfolio slug is required" },
        { status: 400 }
      );
    }

    const q = query(collection(db, "xenotix_portfolios"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const docRef = snapshot.docs[0].ref;
    const existingData = snapshot.docs[0].data();

    const seo = {
      title: data.seo?.title || existingData.seo?.title || existingData.title,
      description: data.seo?.description || existingData.seo?.description || existingData.description,
      keywords: data.seo?.keywords || existingData.seo?.keywords || "",
      ogImageUrl: data.seo?.ogImageUrl || existingData.seo?.ogImageUrl || "",
      imageTitle: data.seo?.imageTitle || existingData.seo?.imageTitle || "",
      altText: data.seo?.altText || existingData.seo?.altText || "",
      metaRobots: data.seo?.metaRobots || existingData.seo?.metaRobots || "index, follow",
    };

    let categories = {};

    if (data.categories && typeof data.categories === "object") {
      Object.keys(data.categories).forEach((catKey) => {
        const category = data.categories[catKey];
        const existingCategory = existingData.categories?.[catKey] || {};

        categories[catKey] = {
          content: category.content || existingCategory.content || "",
          technologies: category.technologies || existingCategory.technologies || [],
          images: category.images || existingCategory.images || [],
          links: category.links || existingCategory.links || [],
          topImages: category.topImages || existingCategory.topImages || []
        };
      });
    } else {
      categories = { ...existingData.categories };
    }

    const updateData = {
      ...(data.title && { title: data.title.trim() }),
      ...(data.category && { category: data.category.trim() }),
      ...(data.description && { description: data.description.trim() }),
      ...(data.client !== undefined && { client: data.client }),
      ...(data.status && { status: data.status }),
      ...(data.image && { image: data.image }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.completedAt && { completedAt: new Date(data.completedAt) }),
      categories,
      slug: generateSlug(data.title),
      seo,
      updatedAt: Timestamp.now(),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await updateDoc(docRef, updateData);

    return NextResponse.json(
      {
        success: true,
        slug,
        message: "Portfolio updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      {
        error: "Failed to update portfolio",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}