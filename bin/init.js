const fs = require("fs");
const process = require("process");

if (fs.existsSync(".env")) {
  console.log(".env already exists.");
  process.exit(1);
}

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

// Generate keys
const userKey = ec.genKeyPair();

const envContent = [
  'CKB_CHAIN="AGGRON4"',
  'CKB_RPC_URL="https://testnet.ckbapp.dev/"',
  'OTX_POOL_RPC_URL="http://127.0.0.1:8118"',
  `USER_PRIVATE_KEY="0x${userKey.getPrivate("hex")}"`,
  "",
];

fs.writeFileSync(".env", envContent.join("\n"));
