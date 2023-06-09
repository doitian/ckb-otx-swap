import Link from "next/link";

import * as styles from "../../styles";
import { renderAssetName, renderAssetBalance } from "../../lib/view-utils";
import AddressText from "../../components/address-text";

export default function AssetsList({ title, address, explorerUrl, assets }) {
  return (
    <section className="mb-8">
      <h3 className="mb-2 text-sm text-indigo-600 font-semibold">{title}</h3>
      <aside className="mb-8">
        <p className="flex flex-wrap justify-end gap-y-2 items-baseline">
          <AddressText
            className="grow shrink"
            address={address}
            explorerUrl={explorerUrl}
          />
          <a
            href="https://faucet.nervos.org/"
            target="_blank"
            className={styles.outlineButton}
          >
            Claim CKB via Faucet
          </a>
        </p>
      </aside>

      <table className="w-full mb-8 table-fixed lg:table-auto">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="px-8">Asset</th>
            <th className="px-8">Balance</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={`${asset.kind}-${asset.identity}`}>
              <th className="px-4 truncate" title={asset.identity}>
                <span>{renderAssetName(asset)}</span>
              </th>
              <td className="px-4 text-right">{renderAssetBalance(asset)}</td>
              <td className="px-4">
                <Link
                  href={`/swap/${asset.kind}/${asset.identity}/SUDT`}
                  className={styles.linkButton}
                >
                  Swap SUDT
                </Link>
                {asset.kind !== "CKB" ? (
                  <Link
                    href={`/swap/${asset.kind}/${asset.identity}/CKB`}
                    className={styles.linkButton}
                  >
                    Swap CKB
                  </Link>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
