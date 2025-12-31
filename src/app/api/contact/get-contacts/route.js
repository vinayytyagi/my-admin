import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const q = query(collection(db, 'xenotix_contact'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const contacts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
