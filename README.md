This is a demo to swap CKB and [SUDT](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md) automatically using [Open Transaction (OTX)](https://github.com/doitian/rfcs/blob/rfc-open-transaction/rfcs/0046-open-transaction/0046-open-transaction.md).

## Getting Started

1. Download [open-transaction-pool](https://github.com/EthanYuan/open-transaction-pool) and build the executable.

    ```bash
    git clone https://github.com/EthanYuan/open-transaction-pool.git ../open-transaction-pool/
    pushd ../open-transaction-pool/
    cargo build --release
    popd
    ```

2. Use the config file `open-transaction-pool.toml` in this repository to start open-transaction-pool.

    ```bash
    ../open-transaction-pool/target/release/open-transaction-pool -c open-transaction-pool.toml
    ```

3. Generate development key pairs for the web server.

    ```
    npm run init
    ```

4. Run the development server.

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the demo.

## Steps to Send a Swap Proposal

- First go to the assets page http://localhost:3000/assets
- Claim CKB via Faucet
- Issue SUDT when there are some CKBs in the account.
- Use the buttons in the assets list to initiate the swap proposal.
