import { blockchain } from "@ckb-lumos/base";
import { bytes, number } from "@ckb-lumos/codec";

function makeKey(key_type, key_data) {
  return { key_type, key_data: key_data !== undefined ? key_data : null };
}

class OtxMap extends Map {}

class OtxMeta extends OtxMap {
  static OTX_VERSIONING_META_OPEN_TX_VERSION = "0x10000";
  static OTX_ACCOUNTING_META_INPUT_CKB = "0x10040";
  static OTX_ACCOUNTING_META_OUTPUT_CKB = "0x10041";
  static OTX_ACCOUNTING_META_MAX_FEE = "0x10043";
  static OTX_ACCOUNTING_META_INPUT_SUDT = "0x10046";
  static OTX_ACCOUNTING_META_OUTPUT_SUDT = "0x10047";

  constructor() {
    super(...arguments);
    this.set(
      makeKey(OtxMeta.OTX_VERSIONING_META_OPEN_TX_VERSION),
      bytes.hexify(number.Uint32LE.pack(1))
    );
  }

  setAccountingInputCkb(amount) {
    this.set(
      makeKey(OtxMeta.OTX_ACCOUNTING_META_INPUT_CKB),
      bytes.hexify(number.Uint64LE.pack(amount))
    );
    return this;
  }

  setAccountingOutputCkb(amount) {
    this.set(
      makeKey(OtxMeta.OTX_ACCOUNTING_META_OUTPUT_CKB),
      bytes.hexify(number.Uint64LE.pack(amount))
    );
    return this;
  }

  setAccountingMaxFee(amount) {
    this.set(
      makeKey(OtxMeta.OTX_ACCOUNTING_META_MAX_FEE),
      bytes.hexify(number.Uint64LE.pack(amount))
    );
    return this;
  }

  setAccountingInputSudt(sudtTypeScript, amount) {
    const key = makeKey(
      OtxMeta.OTX_ACCOUNTING_META_MAX_FEE,
      bytes.hexify(blockchain.Script.pack(sudtTypeScript))
    );
    this.set(key, bytes.hexify(number.Uint128LE.pack(amount)));
    return this;
  }

  setAccountingOutputSudt(sudtTypeScript, amount) {
    const key = makeKey(
      OtxMeta.OTX_ACCOUNTING_META_MAX_FEE,
      bytes.hexify(blockchain.Script.pack(sudtTypeScript))
    );
    this.set(key, bytes.hexify(number.Uint128LE.pack(amount)));
    return this;
  }
}

class OtxCellDep extends OtxMap {
  static OTX_CELL_DEP_OUTPOINT_TX_HASH = "0x02";
  static OTX_CELL_DEP_OUTPOINT_INDEX = "0x03";
  static OTX_CELL_DEP_TYPE = "0x04";

  setFromCkbCellDep(cellDep) {
    this.set(
      makeKey(OtxCellDep.OTX_CELL_DEP_OUTPOINT_TX_HASH),
      cellDep.outPoint.txHash
    );
    this.set(
      makeKey(OtxCellDep.OTX_CELL_DEP_OUTPOINT_INDEX),
      bytes.hexify(number.Uint32LE.pack(cellDep.outPoint.index))
    );
    this.set(
      makeKey(OtxCellDep.OTX_CELL_DEP_TYPE),
      bytes.hexify(blockchain.DepType.pack(cellDep.depType))
    );
    return this;
  }
}

class OtxHeaderDep extends OtxMap {}

class OtxInput extends OtxMap {
  static OTX_INPUT_OUTPOINT_TX_HASH = "0x06";
  static OTX_INPUT_OUTPOINT_INDEX = "0x07";
  static OTX_INPUT_SINCE = "0x08";

  setFromCkbInput(input) {
    this.set(
      makeKey(OtxInput.OTX_INPUT_OUTPOINT_TX_HASH),
      input.previousOutput.txHash
    );
    this.set(
      makeKey(OtxInput.OTX_INPUT_OUTPOINT_INDEX),
      bytes.hexify(number.Uint32LE.pack(input.previousOutput.index))
    );
    this.set(
      makeKey(OtxInput.OTX_INPUT_SINCE),
      bytes.hexify(number.Uint64LE.pack(input.since))
    );
    return this;
  }

  toMolecule() {
    return blockchain.Input.pack({
      previousOutput: {
        txHash: this.get(makeKey(OtxInput.OTX_INPUT_OUTPOINT_TX_HASH)),
        index: number.Uint32LE.unpack(
          this.get(makeKey(OtxInput.OTX_INPUT_OUTPOINT_INDEX))
        ).toHexString(),
      },
      since: number.Uint64LE.unpack(
        this.get(makeKey(OtxInput.OTX_INPUT_SINCE))
      ).toHexString(),
    });
  }
}

class OtxWitness extends OtxMap {
  static OTX_WITNESS_ARGS = "0x0a";

  setFromWitnessArgs(witnessArgs) {
    this.set(
      makeKey(OtxWitness.OTX_WITNESS_ARGS, "0x00"),
      bytes.hexify(blockchain.BytesOpt.pack(witnessArgs.lock))
    );
    this.set(
      makeKey(OtxWitness.OTX_WITNESS_ARGS, "0x01"),
      bytes.hexify(blockchain.BytesOpt.pack(witnessArgs.inputType))
    );
    this.set(
      makeKey(OtxWitness.OTX_WITNESS_ARGS, "0x02"),
      bytes.hexify(blockchain.BytesOpt.pack(witnessArgs.outputType))
    );
    return this;
  }
}

class OtxOutput extends OtxMap {
  static OTX_OUTPUT_CAPACITY = "0x0b";
  static OTX_OUTPUT_LOCK_CODE_HASH = "0x0c";
  static OTX_OUTPUT_LOCK_HASH_TYPE = "0x0d";
  static OTX_OUTPUT_LOCK_ARGS = "0x0e";
  static OTX_OUTPUT_TYPE_CODE_HASH = "0x0f";
  static OTX_OUTPUT_TYPE_HASH_TYPE = "0x10";
  static OTX_OUTPUT_TYPE_ARGS = "0x11";
  static OTX_OUTPUT_DATA = "0x12";

  setFromCkbOutput(output) {
    this.set(
      makeKey(OtxOutput.OTX_OUTPUT_CAPACITY),
      bytes.hexify(number.Uint64LE.pack(output.capacity))
    );
    this.set(
      makeKey(OtxOutput.OTX_OUTPUT_LOCK_CODE_HASH),
      output.lock.codeHash
    );
    this.set(
      makeKey(OtxOutput.OTX_OUTPUT_LOCK_HASH_TYPE),
      bytes.hexify(blockchain.HashType.pack(output.lock.hashType))
    );
    this.set(
      makeKey(OtxOutput.OTX_OUTPUT_LOCK_ARGS),
      bytes.hexify(blockchain.Bytes.pack(output.lock.args))
    );
    if (output.type !== null && output.type !== undefined) {
      this.set(
        makeKey(OtxOutput.OTX_OUTPUT_TYPE_CODE_HASH),
        output.type.codeHash
      );
      this.set(
        makeKey(OtxOutput.OTX_OUTPUT_TYPE_HASH_TYPE),
        bytes.hexify(blockchain.HashType.pack(output.type.hashType))
      );
      this.set(
        makeKey(OtxOutput.OTX_OUTPUT_TYPE_ARGS),
        bytes.hexify(blockchain.Bytes.pack(output.type.args))
      );
    }
    return this;
  }

  setData(data) {
    this.set(
      makeKey(OtxOutput.OTX_OUTPUT_DATA),
      bytes.hexify(blockchain.Bytes.pack(data))
    );
    return this;
  }

  getData(data) {
    return blockchain.Bytes.unpack(
      this.get(makeKey(OtxOutput.OTX_OUTPUT_DATA))
    );
  }

  toMolecule() {
    const lock = {
      codeHash: this.get(makeKey(OtxOutput.OTX_OUTPUT_LOCK_CODE_HASH)),
      hashType: blockchain.HashType.unpack(
        this.get(makeKey(OtxOutput.OTX_OUTPUT_LOCK_HASH_TYPE))
      ),
      args: blockchain.Bytes.unpack(
        this.get(makeKey(OtxOutput.OTX_OUTPUT_LOCK_ARGS))
      ),
    };

    const typeCodeHashKey = makeKey(OtxOutput.OTX_OUTPUT_TYPE_CODE_HASH);
    const type = this.has(typeCodeHashKey)
      ? {
          codeHash: this.get(typeCodeHashKey),
          hashType: blockchain.HashType.unpack(
            this.get(makeKey(OtxOutput.OTX_OUTPUT_TYPE_HASH_TYPE))
          ),
          args: blockchain.Bytes.unpack(
            this.get(makeKey(OtxOutput.OTX_OUTPUT_TYPE_ARGS))
          ),
        }
      : null;

    return blockchain.Output.pack({
      capacity: number.Uint64LE.unpack(
        this.get(makeKey(OtxOutput.OTX_OUTPUT_CAPACITY))
      ).toHexString(),
      lock,
      type,
    });
  }
}

export class OpenTransaction {
  constructor() {
    this.meta = new OtxMeta();
    this.cellDeps = [];
    this.headerDeps = [];
    this.inputs = [];
    this.witnesses = [];
    this.outputs = [];
  }

  static fromJson(json) {
    const tx = new OpenTransaction();
    tx.meta = new OtxMeta(json.meta);
    tx.cellDeps = json.cell_deps.map((item) => new OtxCellDep(item));
    tx.headerDeps = json.header_deps.map((item) => new OtxHeaderDep(item));
    tx.inputs = json.inputs.map((item) => new OtxInput(item));
    tx.witnesses = json.witnesses.map((item) => new OtxWitness(item));
    tx.outputs = json.outputs.map((item) => new OtxOutput(item));
  }

  toJson() {
    return {
      meta: Array.from(this.meta.entries()),
      cell_deps: this.cellDeps.map((item) => Array.from(item.entries())),
      header_deps: this.headerDeps.map((item) => Array.from(item.entries())),
      inputs: this.inputs.map((item) => Array.from(item.entries())),
      witnesses: this.witnesses.map((item) => Array.from(item.entries())),
      outputs: this.outputs.map((item) => Array.from(item.entries())),
    };
  }

  pushNewCellDep() {
    const entity = new OtxCellDep();
    this.cellDeps.push(entity);
    return entity;
  }

  pushNewHeaderDep() {
    const entity = new OtxHeaderDep();
    this.headerDeps.push(entity);
    return entity;
  }

  pushNewInput() {
    const entity = new OtxInput();
    this.inputs.push(entity);
    return entity;
  }

  pushNewWitness() {
    const entity = new OtxWitness();
    this.cellDeps.push(entity);
    return entity;
  }

  pushNewOutput() {
    const entity = new OtxOutput();
    this.cellDeps.push(entity);
    return entity;
  }
}
