import { BI } from "@ckb-lumos/lumos";

export function renderDecimal(number, digits) {
  const integer = number.div(BI.from(10).pow(digits));
  const fraction = number.mod(BI.from(10).pow(digits));
  return `${integer}.${fraction.toString().padStart(digits, "0")}`;
}

export function renderCkbBalance(number) {
  return renderDecimal(number, 8);
}

export function renderAssetName(asset) {
  if (asset.kind === "CKB") {
    return "CKB";
  }

  return `${asset.kind} › ${asset.identity}`;
}

export function renderAssetBalance(asset) {
  if (asset.kind === "CKB") {
    return renderCkbBalance(asset.balance);
  }

  return `${asset.balance}`;
}
