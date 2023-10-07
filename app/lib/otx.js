import { blockchain } from "@ckb-lumos/base";
import { bytes, number } from "@ckb-lumos/codec";

export function makeKey(keyType, keyData) {
  return `${bytes.hexify(number.Uint32LE.pack(keyType))}${
    keyData !== null && keyData !== undefined ? keyData : ""
  }`;
}

export function fromJsonKeyPair([key, value]) {
  return [makeKey(key), value];
}

export function toJsonKeyPair([key, value]) {
  const keyTypeBuf = key.substring(0, 10);
  const keyData = key.substring(10);
  return [
    {
      key_type: `0x${number.Uint32LE.unpack(keyTypeBuf).toString(16)}`,
      key_data: keyData !== "" ? keyData : null,
    },
    value,
  ];
}

class OtxMap extends Map {}

export class OtxMeta extends OtxMap {
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
      OtxMeta.OTX_ACCOUNTING_META_INPUT_SUDT,
      bytes.hexify(blockchain.Script.pack(sudtTypeScript))
    );
    this.set(key, bytes.hexify(number.Uint128LE.pack(amount)));
    return this;
  }

  setAccountingOutputSudt(sudtTypeScript, amount) {
    const key = makeKey(
      OtxMeta.OTX_ACCOUNTING_META_OUTPUT_SUDT,
      bytes.hexify(blockchain.Script.pack(sudtTypeScript))
    );
    this.set(key, bytes.hexify(number.Uint128LE.pack(amount)));
    return this;
  }
}

export class OtxCellDep extends OtxMap {
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

export class OtxHeaderDep extends OtxMap {}

export class OtxInput extends OtxMap {
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
    return blockchain.CellInput.pack({
      previousOutput: {
        txHash: this.get(makeKey(OtxInput.OTX_INPUT_OUTPOINT_TX_HASH)),
        index: `0x${number.Uint32LE.unpack(
          this.get(makeKey(OtxInput.OTX_INPUT_OUTPOINT_INDEX))
        ).toString(16)}`,
      },
      since: number.Uint64LE.unpack(
        this.get(makeKey(OtxInput.OTX_INPUT_SINCE))
      ).toHexString(),
    });
  }
}

export class OtxWitness extends OtxMap {
  static OTX_WITNESS_INPUT_LOCK = "0x0a";
  static OTX_WITNESS_INPUT_TYPE = "0x0b";
  static OTX_WITNESS_OUTPUT_TYPE = "0x0c";

  setFromWitnessArgs(witnessArgs) {
    this.set(
      makeKey(OtxWitness.OTX_WITNESS_INPUT_LOCK),
      bytes.hexify(blockchain.BytesOpt.pack(witnessArgs.lock))
    );
    this.set(
      makeKey(OtxWitness.OTX_WITNESS_INPUT_TYPE),
      bytes.hexify(blockchain.BytesOpt.pack(witnessArgs.inputType))
    );
    this.set(
      makeKey(OtxWitness.OTX_WITNESS_OUTPUT_TYPE),
      bytes.hexify(blockchain.BytesOpt.pack(witnessArgs.outputType))
    );
    return this;
  }
}

export class OtxOutput extends OtxMap {
  static OTX_OUTPUT_CAPACITY = "0x0d";
  static OTX_OUTPUT_LOCK_CODE_HASH = "0x0e";
  static OTX_OUTPUT_LOCK_HASH_TYPE = "0x0f";
  static OTX_OUTPUT_LOCK_ARGS = "0x10";
  static OTX_OUTPUT_TYPE_CODE_HASH = "0x12";
  static OTX_OUTPUT_TYPE_HASH_TYPE = "0x13";
  static OTX_OUTPUT_TYPE_ARGS = "0x14";
  static OTX_OUTPUT_DATA = "0x15";

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
    this.set(makeKey(OtxOutput.OTX_OUTPUT_LOCK_ARGS), output.lock.args);
    if (output.type !== null && output.type !== undefined) {
      this.set(
        makeKey(OtxOutput.OTX_OUTPUT_TYPE_CODE_HASH),
        output.type.codeHash
      );
      this.set(
        makeKey(OtxOutput.OTX_OUTPUT_TYPE_HASH_TYPE),
        bytes.hexify(blockchain.HashType.pack(output.type.hashType))
      );
      this.set(makeKey(OtxOutput.OTX_OUTPUT_TYPE_ARGS), output.type.args);
    }
    return this;
  }

  setData(data) {
    this.set(makeKey(OtxOutput.OTX_OUTPUT_DATA), data);
    return this;
  }

  getData() {
    return this.get(makeKey(OtxOutput.OTX_OUTPUT_DATA));
  }

  toMolecule() {
    const lock = {
      codeHash: this.get(makeKey(OtxOutput.OTX_OUTPUT_LOCK_CODE_HASH)),
      hashType: blockchain.HashType.unpack(
        this.get(makeKey(OtxOutput.OTX_OUTPUT_LOCK_HASH_TYPE))
      ),
      args: this.get(makeKey(OtxOutput.OTX_OUTPUT_LOCK_ARGS)),
    };

    const typeCodeHashKey = makeKey(OtxOutput.OTX_OUTPUT_TYPE_CODE_HASH);
    const type = this.has(typeCodeHashKey)
      ? {
          codeHash: this.get(typeCodeHashKey),
          hashType: blockchain.HashType.unpack(
            this.get(makeKey(OtxOutput.OTX_OUTPUT_TYPE_HASH_TYPE))
          ),
          args: this.get(makeKey(OtxOutput.OTX_OUTPUT_TYPE_ARGS)),
        }
      : null;

    return blockchain.CellOutput.pack({
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
    tx.meta = new OtxMeta(json.meta.map(fromJsonKeyPair));
    tx.cellDeps = json.cell_deps.map(
      (item) => new OtxCellDep(item.map(fromJsonKeyPair))
    );
    tx.headerDeps = json.header_deps.map(
      (item) => new OtxHeaderDep(item.map(fromJsonKeyPair))
    );
    tx.inputs = json.inputs.map(
      (item) => new OtxInput(item.map(fromJsonKeyPair))
    );
    tx.witnesses = json.witnesses.map(
      (item) => new OtxWitness(item.map(fromJsonKeyPair))
    );
    tx.outputs = json.outputs.map(
      (item) => new OtxOutput(item.map(fromJsonKeyPair))
    );
  }

  toJson() {
    return {
      meta: Array.from(this.meta.entries()).map(toJsonKeyPair),
      cell_deps: this.cellDeps.map((item) =>
        Array.from(item.entries()).map(toJsonKeyPair)
      ),
      header_deps: this.headerDeps.map((item) =>
        Array.from(item.entries()).map(toJsonKeyPair)
      ),
      inputs: this.inputs.map((item) =>
        Array.from(item.entries()).map(toJsonKeyPair)
      ),
      witnesses: this.witnesses.map((item) =>
        Array.from(item.entries()).map(toJsonKeyPair)
      ),
      outputs: this.outputs.map((item) =>
        Array.from(item.entries()).map(toJsonKeyPair)
      ),
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
    this.witnesses.push(entity);
    return entity;
  }

  pushNewOutput() {
    const entity = new OtxOutput();
    this.outputs.push(entity);
    return entity;
  }
}
