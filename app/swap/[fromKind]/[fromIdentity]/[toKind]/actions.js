"use server";

import { redirect } from "next/navigation";
import { BI, helpers, commons } from "@ckb-lumos/lumos";
import { number, bytes } from "@ckb-lumos/codec";

import { injectConfig } from "@/app/lib/runtime-config";
import {
  buildSwapProposal,
  signSingleAnyoneCanPay,
  SWAP_FEE,
} from "@/app/swap/builder";

const {
  sudt,
  common: { payFeeByFeeRate, transfer },
} = commons;

function parseBalance(kind, text) {
  const view = BI.from(text);
  if (kind === "CKB") {
    return view.mul(BI.from(10).pow(8));
  }
  return view;
}

function decodeSwapRequest(data) {
  return {
    from: {
      kind: data.get("fromKind"),
      identity: data.get("fromIdentity"),
      balance: parseBalance(data.get("fromKind"), data.get("fromAmount")),
    },
    to: {
      kind: data.get("toKind"),
      identity: data.get("toIdentity"),
      balance: parseBalance(data.get("toKind"), data.get("toAmount")),
    },
  };
}

function cellCapacity(wallet, fee) {
  const targetOutput = {
    cellOutput: {
      capacity: "0x0",
      lock: wallet.otxLockScript(),
      type: wallet.sudtTypeScript(),
    },
    data: bytes.hexify(number.Uint128LE.pack(0)),
    outPoint: undefined,
    blockHash: undefined,
  };
  return BI.from(helpers.minimalCellCapacityCompatible(targetOutput)).add(fee);
}

function setOutputCapacity(txSkeleton, outputIndex, capacity) {
  return txSkeleton.update("outputs", (outputs) =>
    outputs.update(1, (output) => ({
      ...output,
      cellOutput: {
        ...output.cellOutput,
        capacity,
      },
    }))
  );
}

async function createCellFromSwapRequest(config, from) {
  const wallet = config.getWallet();
  const ckbIndexer = config.buildCkbIndexer();
  let txSkeleton = helpers.TransactionSkeleton({
    cellProvider: ckbIndexer,
  });
  const minCapacity = cellCapacity(wallet, SWAP_FEE);

  if (from.kind === "CKB") {
    txSkeleton = await prepareCkbSwapTxSkeleton(
      txSkeleton,
      from,
      wallet,
      config,
      minCapacity
    );
  } else {
    txSkeleton = await prepareSudtSwapTxSkeleton(
      txSkeleton,
      from,
      wallet,
      config,
      minCapacity
    );
  }

  const tx = wallet.signTx(txSkeleton);
  const hash = await config
    .buildCkbRpcClient()
    .sendTransaction(tx, "passthrough");

  return {
    tx,
    hash,
  };
}

async function prepareCkbSwapTxSkeleton(
  txSkeleton,
  from,
  wallet,
  config,
  minCapacity
) {
  let capacity = from.balance.add(minCapacity);
  const secp256k1Address = wallet.secp256k1Address();

  txSkeleton = await transfer(
    txSkeleton,
    [secp256k1Address],
    wallet.otxAddress(),
    capacity,
    undefined,
    undefined,
    { config: config.ckbChainConfig }
  );

  return await payFeeByFeeRate(
    txSkeleton,
    [secp256k1Address],
    1000,
    undefined,
    { config: config.ckbChainConfig }
  );
}

async function prepareSudtSwapTxSkeleton(
  txSkeleton,
  from,
  wallet,
  config,
  minCapacity
) {
  const secp256k1Address = wallet.secp256k1Address();

  txSkeleton = await sudt.transfer(
    txSkeleton,
    [secp256k1Address],
    from.identity,
    wallet.otxAddress(),
    from.balance,
    undefined,
    minCapacity,
    undefined,
    { config: config.ckbChainConfig }
  );

  const changeCell = txSkeleton.get("outputs").get(1);

  if (changeCell !== undefined) {
    const newChangeCapacity = BI.from(changeCell.cellOutput.capacity)
      .sub(SWAP_FEE)
      .sub(minCapacity);
    if (newChangeCapacity.gt(minCapacity)) {
      txSkeleton = setOutputCapacity(txSkeleton, 1, minCapacity.toHexString());
      // create a new change cell for plain CKB
      return txSkeleton.update("outputs", (outputs) =>
        outputs.push({
          cellOutput: {
            capacity: newChangeCapacity.toHexString(),
            lock: wallet.secp256k1LockScript(),
          },
          data: "0x",
        })
      );
    }
  }

  return await payFeeByFeeRate(
    txSkeleton,
    [secp256k1Address],
    1000,
    undefined,
    { config: config.ckbChainConfig }
  );
}

export async function swapAssets(data, config = injectConfig()) {
  const wallet = config.getWallet();
  const swapRequest = decodeSwapRequest(data);
  const locking = await createCellFromSwapRequest(config, swapRequest.from);

  const otx = await buildSwapProposal(
    wallet,
    locking,
    swapRequest,
    config.ckbChainConfig
  );

  signSingleAnyoneCanPay(wallet, otx, 0);
  await config.buildOtxPoolRpcClient().submitOtx(otx);

  redirect("/swap");
}
