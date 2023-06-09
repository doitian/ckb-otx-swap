import { BI } from "@ckb-lumos/lumos";
import Link from "next/link";

import { injectConfig } from "../lib/runtime-config";
import AssetsIndexer from "../lib/assets-indexer";
import PageTitle from "../components/page-title";
import AssetsList from "./components/assets-list";

export const metadata = {
  title: "Assets",
};

export default async function AssetsPage({ config = injectConfig() }) {
  const wallet = config.getWallet();
  const ckbIndexer = config.buildCkbIndexer();
  const indexer = new AssetsIndexer(ckbIndexer, config.ckbChainConfig);

  const otxAssets = await indexer.listAssets(wallet.otxLockScript());

  return (
    <>
      <PageTitle>{metadata.title}</PageTitle>
      <AssetsList
        title="OTX Account"
        address={wallet.otxAddress()}
        assets={otxAssets}
      />

      <p className="text-right">
        <Link
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          href="/issue-sudt"
        >
          Issue SUDT
        </Link>
      </p>
    </>
  );
}
