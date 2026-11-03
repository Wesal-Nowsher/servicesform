import { createHash } from "crypto";
export const COOKIE = "admin_session";
export const token = () => createHash("sha256").update("admin:" + (process.env.ADMIN_PASSWORD || "")).digest("hex");
