import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore";

export async function GET(_, { params }) {
    try {
        const { char } = params;

        if (!char || char.length !== 1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid character parameter",
                },
                { status: 400 }
            );
        }

        const character = char.toUpperCase();
        let q = collection(db, "xenotix_blogs");
        let filters = [];

        if (character === "#") {
            const numericBlogs = [];
            const allBlogsQuery = query(collection(db, "xenotix_blogs"), orderBy("title", "asc"));
            const allBlogsSnapshot = await getDocs(allBlogsQuery);

            allBlogsSnapshot.forEach((doc) => {
                const data = doc.data();
                const firstChar = data.title?.charAt(0).toUpperCase();

                if (firstChar && !/[A-Z]/.test(firstChar)) {
                    let createdAtISO = new Date().toISOString();
                    try {
                        if (data.createdAt?.seconds) {
                            createdAtISO = new Date(data.createdAt.seconds * 1000).toISOString();
                        } else if (typeof data.createdAt === "string") {
                            createdAtISO = new Date(data.createdAt).toISOString();
                        }
                    } catch (err) {
                        console.warn("Invalid createdAt in blog:", doc.id);
                    }

                    numericBlogs.push({
                        id: doc.id,
                        ...data,
                        createdAt: createdAtISO,
                    });
                }
            });

            return NextResponse.json({
                success: true,
                blogs: numericBlogs,
                character: character
            });
        } else {
            filters.push(
                where("title", ">=", character),
                where("title", "<", character + "\uf8ff"),
                orderBy("title", "asc")
            );
        }

        const finalQuery = query(q, ...filters);
        const querySnapshot = await getDocs(finalQuery);

        let blogs = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const titleFirstChar = data.title?.charAt(0).toUpperCase();

            if (titleFirstChar === character) {
                let createdAtISO = new Date().toISOString();
                try {
                    if (data.createdAt?.seconds) {
                        createdAtISO = new Date(data.createdAt.seconds * 1000).toISOString();
                    } else if (typeof data.createdAt === "string") {
                        createdAtISO = new Date(data.createdAt).toISOString();
                    }
                } catch (err) {
                    console.warn("Invalid createdAt in blog:", doc.id);
                }

                blogs.push({
                    id: doc.id,
                    title: data.title,
                    slug: data.slug,
                    createdAt: createdAtISO,
                });
            }
        });

        return NextResponse.json({
            success: true,
            blogs,
            character: character
        });
    } catch (error) {
        console.error("Error fetching filtered blogs:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch filtered blogs",
                error: error.message,
            },
            { status: 500 }
        );
    }
}