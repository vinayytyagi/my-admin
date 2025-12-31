import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, deleteDoc, getDoc } from "firebase/firestore";

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        
        if (!id) {
            return NextResponse.json(
                { error: "Sponsored item ID is required" },
                { status: 400 }
            );
        }

        const docRef = doc(db, "xenotix_sponsored", id);
        
        // Check if document exists
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return NextResponse.json(
                { error: "Sponsored item not found" },
                { status: 404 }
            );
        }

        await deleteDoc(docRef);

        return NextResponse.json(
            {
                success: true,
                sponsoredId: id,
                message: "Sponsored item deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting sponsored item:", error);
        return NextResponse.json(
            {
                error: "Failed to delete sponsored item",
                details: error.message,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}