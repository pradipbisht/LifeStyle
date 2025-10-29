import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role, isVerified } =
      await request.json();

    // Create Firebase Auth user using Firebase Admin REST API
    const createUserResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!createUserResponse.ok) {
      const error = await createUserResponse.json();
      throw new Error(error.error?.message || "Failed to create user");
    }

    const userData = await createUserResponse.json();

    return NextResponse.json({
      success: true,
      userId: userData.localId,
    });
  } catch (error: any) {
    console.error("Error in create-user API:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
