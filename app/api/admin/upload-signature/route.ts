import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: Request) {
  try {
    // ------------------------------------------------------------
    // VÉRIFICATION DE LA SESSION ADMIN
    // ------------------------------------------------------------

    const cookieHeader = request.headers.get("cookie") ?? "";

    const sessionCookie = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) =>
        cookie.startsWith("coupe_de_woof_admin=")
      );

    const session = sessionCookie?.split("=")[1];
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (
      !sessionSecret ||
      !session ||
      session !== sessionSecret
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Non autorisé.",
        },
        {
          status: 401,
        }
      );
    }

    // ------------------------------------------------------------
    // CONFIGURATION CLOUDINARY
    // ------------------------------------------------------------

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Configuration Cloudinary incomplète.");

      return NextResponse.json(
        {
          success: false,
          error: "Configuration Cloudinary manquante.",
        },
        {
          status: 500,
        }
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
      signature_algorithm: "sha256",
    });

    // ------------------------------------------------------------
    // PARAMÈTRES DE L'UPLOAD
    // ------------------------------------------------------------

    const timestamp = Math.round(Date.now() / 1000);

    const folder = "coupe-de-woof";

    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    // ------------------------------------------------------------
    // RÉPONSE
    // ------------------------------------------------------------

    return NextResponse.json({
      success: true,
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
    });
  } catch (error) {
    console.error(
      "Erreur génération signature Cloudinary :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Impossible de préparer l'upload.",
      },
      {
        status: 500,
      }
    );
  }
}