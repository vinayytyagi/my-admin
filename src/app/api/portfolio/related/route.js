export const revalidate = 0;

import { NextResponse } from "next/server";
import {
    collection,
    query,
    where,
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

        const portfoliosRef = collection(db, "xenotix_portfolios");

        const portfolioQuery = query(
            portfoliosRef,
            where("category", "==", category),
            limit(5),
        );

        const querySnapshot = await getDocs(portfolioQuery);

        let portfolios = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((portfolio) => normalizeSlug(portfolio?.slug) !== excludeSlug);

        const lastThreePortfolios = portfolios.slice(-3);

        return NextResponse.json(lastThreePortfolios, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}