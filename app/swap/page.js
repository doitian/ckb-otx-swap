import PageTitle from "@/app/components/page-title";
import { injectConfig } from "@/app/lib/runtime-config";
import { OpenTransaction } from "@/app/lib/otx";

export default async function SwapPage({ config = injectConfig() }) {
  const wallet = config.getWallet();
  const otxPoolRpc = config.buildOtxPoolRpcClient();
  const proposals = await otxPoolRpc.getAllSwapProposals();

  return (
    <div>
      <PageTitle>Swap Proposals</PageTitle>

      <pre>{JSON.stringify(proposals, null, 2)}</pre>
    </div>
  );
}
