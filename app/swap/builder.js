import { BI, utils } from "@ckb-lumos/lumos";
import { bytes, number } from "@ckb-lumos/codec";
import { blockchain } from "@ckb-lumos/base";

import { OpenTransaction } from "@/app/lib/otx";

// The OTX Pool requires a total fee of 1 CKB
export const SWAP_FEE = BI.from("50000000");

/* 66-byte zeros in hex */
const OTX_SIGNATURE_PLACEHOLDER =
  "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

export async function buildSwapProposal(
  wallet,
  locking,
  swapRequest,
  ckbChainConfig,
) {
  const otx = new OpenTransaction();

  // input
  const from = {
    previousOutput: {
      txHash: locking.hash,
      index: "0x1",
    },
    since: "0x0",
  };
  otx.pushNewInput().setFromCkbInput(from);

  // output
  const inputCapacity = BI.from(locking.tx.outputs[0].capacity);
  let outputCapacity = inputCapacity.sub(SWAP_FEE);
  if (swapRequest.from.kind === "CKB") {
    outputCapacity = outputCapacity.sub(swapRequest.from.balance);
  }
  if (swapRequest.to.kind === "CKB") {
    outputCapacity = outputCapacity.add(swapRequest.to.balance);
  }

  const to = {
    capacity: outputCapacity,
    lock: wallet.secp256k1LockScript(),
  };

  if (swapRequest.to.kind === "SUDT") {
    to.type = wallet.sudtTypeScriptOf(swapRequest.to.identity);
  }

  const outData =
    swapRequest.to.kind === "CKB"
      ? "0x"
      : bytes.hexify(number.Uint128LE.pack(swapRequest.to.balance));
  otx.pushNewOutput().setFromCkbOutput(to).setData(outData);

  // deps
  const { OTXLOCK, SUDT } = ckbChainConfig.SCRIPTS;
  for (const script of [OTXLOCK, SUDT]) {
    otx.pushNewCellDep().setFromCkbCellDep({
      outPoint: {
        txHash: script.TX_HASH,
        index: script.INDEX,
      },
      depType: script.DEP_TYPE,
    });
  }

  // accounting meta
  otx.meta.setAccountingMaxFee(SWAP_FEE);
  otx.meta.setAccountingInputCkb(inputCapacity);
  otx.meta.setAccountingOutputCkb(outputCapacity);
  if (swapRequest.from.kind === "SUDT") {
    otx.meta.setAccountingInputSudt(
      wallet.sudtTypeScriptOf(swapRequest.from.identity),
      swapRequest.from.balance,
    );
  }
  if (swapRequest.to.kind === "SUDT") {
    otx.meta.setAccountingOutputSudt(
      wallet.sudtTypeScriptOf(swapRequest.to.identity),
      swapRequest.to.balance,
    );
  }

  return otx;
}

export function singleAnyoneCanPayDigest(otx, index) {
  const inputBuf = otx.inputs[index].toMolecule();
  const outputBuf = otx.outputs[index].toMolecule();
  const dataBuf = bytes.bytify(otx.outputs[index].getData());

  const witness = {
    lock: OTX_SIGNATURE_PLACEHOLDER,
    inputType: null,
    outputType: null,
  };
  const witnessBuf = blockchain.WitnessArgs.pack(witness);

  // hash
  const hasher = new utils.CKBHasher();
  hasher.update(number.Uint64LE.pack(inputBuf.length));
  hasher.update(inputBuf);
  hasher.update(number.Uint64LE.pack(outputBuf.length));
  hasher.update(outputBuf);
  hasher.update(number.Uint64LE.pack(dataBuf.length));
  hasher.update(dataBuf);
  hasher.update(number.Uint64LE.pack(witnessBuf.length));
  hasher.update(witnessBuf);
  const message = bytes.bytify(hasher.digestHex());

  return digestWithOtxPrefix("0x83", message);
}

function digestWithOtxPrefix(sighash, messageBuf) {
  const hasher = new utils.CKBHasher();
  hasher.update(bytes.bytifyRawString("COTX "));
  hasher.update(bytes.bytify(sighash));
  hasher.update(bytes.bytifyRawString(":\n"));
  hasher.update(bytes.bytifyRawString(messageBuf.length.toString()));
  hasher.update(messageBuf);
  return hasher.digestHex();
}

export function signSingleAnyoneCanPay(wallet, otx, index) {
  const digest = singleAnyoneCanPayDigest(otx, index);
  const signature = wallet.signRecoverable(digest);
  otx.pushNewWitness().setFromWitnessArgs({ lock: digest });
}
