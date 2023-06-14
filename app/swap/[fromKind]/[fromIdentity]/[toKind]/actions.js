"use server";

import { redirect } from "next/navigation";

export async function swapAssets(data) {
  // TODO
  console.log(data);

  redirect("/swap");
}
