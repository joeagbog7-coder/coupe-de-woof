import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body.password;

    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminPassword || !sessionSecret) {
      console.error("ADMIN_PASSWORD ou ADMIN_SESSION_SECRET manquant.");

      return NextResponse.json(
        {
          success: false,
          error: "Configuration administrateur manquante.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      typeof password !== "string" ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Mot de passe incorrect.",
        },
        {
          status: 401,
        }
      );
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set({
      name: "coupe_de_woof_admin",
      value: sessionSecret,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Erreur connexion admin :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Impossible de se connecter.",
      },
      {
        status: 500,
      }
    );
  }
}