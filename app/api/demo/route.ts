import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bedrijfsnaam, email, volume, bericht } = body;

    if (!bedrijfsnaam || !email) {
      return NextResponse.json(
        { error: 'Bedrijfsnaam en e-mailadres zijn verplicht' },
        { status: 400 }
      );
    }

    // TODO: Integrate with email service or database
    console.log('Demo request received:', { bedrijfsnaam, email, volume, bericht });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van uw aanvraag' },
      { status: 500 }
    );
  }
}
