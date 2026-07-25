import { NextResponse } from "next/server";

const API_URL = (
  process.env.SELLEROS_API_URL ?? "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

type AuthResponse = {
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar: string | null;
    is_email_verified: boolean;
    is_phone_verified: boolean;
  };
  tokens: {
    access: string;
    refresh: string;
  };
};

function messageFrom(payload: unknown, fallback: string) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "detail" in payload &&
    typeof payload.detail === "string"
  )
    return payload.detail;
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
  )
    return payload.message;
  return fallback;
}

function setAuthCookies(response: NextResponse, payload: AuthResponse) {
  const secure = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
  };
  response.cookies.set("selleros_access", payload.tokens.access, {
    ...options,
    maxAge: 60 * 15,
  });
  response.cookies.set("selleros_refresh", payload.tokens.refresh, {
    ...options,
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set("selleros_user", JSON.stringify(payload.user), {
    ...options,
    maxAge: 60 * 60 * 24 * 30,
  });
}

// Actions that return {user, tokens} and should set auth cookies
const AUTH_ISSUING_ACTIONS = new Set([
  "login",
  "register-disabled",
  "verify-otp",
]);
// (register no longer issues tokens directly — it now returns an OTP-sent ack)
const PROXY_ACTIONS = new Set([
  "login",
  "register",
  "verify-otp",
  "resend-otp",
]);

export async function POST(
  request: Request,
  context: RouteContext<"/api/auth/[action]">,
) {
  const { action } = await context.params;

  if (action === "logout") {
    const refreshToken = request.headers
      .get("cookie")
      ?.match(/(?:^|; )selleros_refresh=([^;]+)/)?.[1];
    try {
      if (refreshToken)
        await fetch(
          `${API_URL}/auth/logout?refresh_token=${encodeURIComponent(decodeURIComponent(refreshToken))}`,
          { method: "POST", cache: "no-store" },
        );
    } finally {
      const response = NextResponse.json({ message: "Logged out." });
      response.cookies.delete("selleros_access");
      response.cookies.delete("selleros_refresh");
      response.cookies.delete("selleros_user");
      return response;
    }
  }

  if (!PROXY_ACTIONS.has(action)) {
    return NextResponse.json(
      { message: "Unknown authentication action." },
      { status: 404 },
    );
  }

  try {
    const body = await request.json();
    const backend = await fetch(`${API_URL}/auth/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload: unknown = await backend.json();

    if (!backend.ok) {
      console.log("Django error payload:", JSON.stringify(payload, null, 2));

      return NextResponse.json(
        {
          message: messageFrom(payload, "Authentication failed."),
        },
        {
          status: backend.status,
        },
      );
    }

    // Login & Verify OTP -> Set Cookies
    if (action === "login" || action === "verify-otp") {
      const response = NextResponse.json({
        user: (payload as AuthResponse).user,
      });

      setAuthCookies(response, payload as AuthResponse);

      return response;
    }

    return NextResponse.json(payload as Record<string, unknown>);
  } catch {
    return NextResponse.json(
      {
        message:
          "Unable to reach SellerOS API. Check SELLEROS_API_URL and make sure the backend is running.",
      },
      { status: 502 },
    );
  }
}
