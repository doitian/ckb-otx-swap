"use server";

import { redirect } from "next/navigation";
import { BI } from "@ckb-lumos/lumos";

function parseBalance(kind, text) {
  const view = BI.from(text);
  if (kind === "CKB") {
    return view.mul(BI.from(10).pow(8));
  }
  return view;
}

function decodeSwapRequest(data) {
  console.log({ from: data.get("fromAmount"), to: data.get("toAmount") });
  return {
    from: {
      kind: data.get("fromKind"),
      indentity: data.get("fromIdentity"),
      balance: parseBalance(data.get("fromKind"), data.get("fromAmount")),
    },
    to: {
      kind: data.get("toKind"),
      indentity: data.get("toIdentity"),
      balance: parseBalance(data.get("toKind"), data.get("toAmount")),
    },
  };
}

export async function swapAssets(data) {
  const swapRequest = decodeSwapRequest(data);
  const cell = await createCellFormSwapRequest(swapRequest.from);
  const otx = await buildSwapProposal(cell, swapRequest.to);
  wallet.signOtx(otx, 0);
  await otxPoolRpc.submitOtx(otx);

  redirect("/swap");
}
