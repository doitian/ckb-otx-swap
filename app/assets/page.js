import { BI } from "@ckb-lumos/lumos";
import Link from "next/link";

import * as styles from "../styles";
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

  const assets = await indexer.listAssets(wallet.secp256k1LockScript());

  return (
    <>
      <PageTitle>{metadata.title}</PageTitle>
      <AssetsList
        title="Secp256k1 Account"
        address={wallet.secp256k1Address()}
        explorerUrl={config.ckbChainConfig.EXPLORER_URL}
        assets={assets}
      />

      <p className="text-right">
        <Link className={styles.outlineButton} href="/issue-sudt">
          Issue SUDT
        </Link>
      </p>
    </>
  );
}
