"use server";

import config from "@payload-config";
import { logout } from "@payloadcms/next/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/auth";

export type InlogStatus = { fout?: string; email?: string };

export async function inloggen(_vorige: InlogStatus, formData: FormData): Promise<InlogStatus> {
  const email = String(formData.get("email") ?? "").trim().slice(0, 254);
  const password = String(formData.get("wachtwoord") ?? "").slice(0, 200);

  if (!email || !password) return { email, fout: "Vul je e-mailadres en wachtwoord in." };

  try {
    const payload = await payloadClient();
    const { token, exp } = await payload.login({ collection: "users", data: { email, password } });
    if (!token) throw new Error("Geen token");
    // Set the cookie ourselves: login() from @payloadcms/next/auth (3.92) reads
    // tokenExpiration (seconds) as milliseconds, which logs you out after 43 s.
    const auth = payload.collections.users.config.auth;
    (await cookies()).set(`${payload.config.cookiePrefix}-token`, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: Boolean(auth.cookies.secure),
      expires: exp ? new Date(exp * 1000) : undefined,
    });
  } catch {
    // One message on purpose: it does not reveal whether the address exists.
    return { email, fout: "Dit e-mailadres en wachtwoord horen niet bij elkaar. Na vijf pogingen wacht je een kwartier." };
  }
  redirect("/");
}

export async function uitloggen() {
  await logout({ config });
  redirect("/inloggen");
}
