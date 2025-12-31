export const revalidate = 0;

import { NextResponse } from "next/server";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { normalizeSlug } from "@/util/generateSlug";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const excludeSlug = searchParams.get("exclude");

        if (!category) {
            return NextResponse.json(
                { message: "No category provided" },
                { status: 400 },
            );
        }

        const blogsRef = collection(db, "xenotix_blogs");

        const blogsQuery = query(
            blogsRef,
            where("category", "==", category),
            where("status", "==", "active"),
            limit(5),
        );

        const querySnapshot = await getDocs(blogsQuery);

        let blogs = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((blog) => normalizeSlug(blog?.slug) !== excludeSlug);

        const lastThreeBlogs = blogs.slice(-3);

        return NextResponse.json(lastThreeBlogs, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}