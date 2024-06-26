"use server";

import { redirect } from "next/navigation";

export async function doRedirect(url: string) {
  redirect(url);
}
