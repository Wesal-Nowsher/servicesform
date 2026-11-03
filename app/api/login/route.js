import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, token } from "@/lib/auth";

export async function POST(req) {
  const f = await req.formData();
  if (f.get("logout")) { cookies().delete(COOKIE); redirect("/admin"); }
  if (process.env.ADMIN_PASSWORD && f.get("password") === process.env.ADMIN_PASSWORD) {
    cookies().set(COOKIE, token(), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    redirect("/admin");
  }
  redirect("/admin?error=1");
}
