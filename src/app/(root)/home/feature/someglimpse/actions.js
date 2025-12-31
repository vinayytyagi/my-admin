"use server";

import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function getSomeGlimpseData() {
  try {
    const someGlimpseDoc = doc(db, "home", "someglimpse");
    const docSnap = await getDoc(someGlimpseDoc);
    
    if (docSnap.exists()) {
      return {
        success: true,
        someGlimpse: { id: docSnap.id, ...docSnap.data() }
      };
    } else {
      return {
        success: true,
        someGlimpse: {
          stories: [],
          header: {
            badgeText: "PROJECT STORIES",
            title: "Some Glimpse",
            description: "Journey through our most impactful projects and see how we transform ideas into digital experiences"
          }
        }
      };
    }
  } catch (error) {
    console.error("Error fetching SomeGlimpse data:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function saveSomeGlimpseData(data) {
  try {
    const someGlimpseDoc = doc(db, "home", "someglimpse");
    const existingDoc = await getDoc(someGlimpseDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    const updatedData = {
      ...existingData,
      ...data,
      stories: data.stories !== undefined ? data.stories : existingData.stories || []
    };
    
    await setDoc(someGlimpseDoc, updatedData);
    
    revalidatePath("/home/feature/someglimpse");
    
    return {
      success: true,
      message: "SomeGlimpse section saved successfully"
    };
  } catch (error) {
    console.error("Error saving SomeGlimpse data:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

