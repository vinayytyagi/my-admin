import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req) {
  try {
    const body = await req.json();
    
    const { name, email, phone, budget, requirement, description } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    await addDoc(collection(db, 'xenotix_contact'), {
      name,
      email,
      phone,
      budget,
      requirement,
      description,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Contact saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
