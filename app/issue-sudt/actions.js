"use server";

import { redirect } from "next/navigation";

import { injectConfig } from "../lib/runtime-config";
import SudtIssuer from "../lib/sudt-issuer";

export async function issueSudt(data, config = injectConfig()) {
  const wallet = config.getWallet();
  const ckbIndexer = config.buildCkbIndexer();
  const ckbRpcClient = config.buildCkbRpcClient();
  const issuer = new SudtIssuer(
    wallet,
    ckbRpcClient,
    ckbIndexer,
    config.ckbChainConfig
  );

  const amount = parseInt(data.get("amount"), 10);
  await issuer.issue(amount);
  redirect("/assets");
}
