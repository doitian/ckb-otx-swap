import PageTitle from "@/app/components/page-title";
import { injectConfig } from "@/app/lib/runtime-config";
import { OpenTransaction } from "@/app/lib/otx";

export default async function SwapPage({ config = injectConfig() }) {
  const wallet = config.getWallet();
  const otxPoolRpc = config.buildOtxPoolRpcClient();
  const proposals = await otxPoolRpc.getAllSwapProposals();
  const otx = new OpenTransaction();
  otx
    .pushNewOutput()
    .setFromCkbOutput({
      capacity: "0x1000",
      lock: wallet.otxLockScript(),
    })
    .setData("0xff");

  return (
    <div>
      <PageTitle>Swap Proposals</PageTitle>

      <pre>{JSON.stringify(proposals, null, 2)}</pre>

      <pre>{JSON.stringify(otx.toJson(), null, 2)}</pre>
    </div>
  );
}
