/* eslint-disable max-len */
import { NativeModules } from 'react-native';
import { decode as base64_decode, encode as base64_encode } from 'base-64';

const { HaskellShelley } = NativeModules;

// export default HaskellShelley;

function Uint8ArrayFromB64(base64_string) {
  return Uint8Array.from(base64_decode(base64_string), c => c.charCodeAt(0));
}

function b64FromUint8Array(uint8Array) {
  return base64_encode(String.fromCharCode.apply(null, uint8Array));
}


class Ptr {
  static _wrap(ptr, klass) {
    if (ptr === '0') {
      return undefined;
    }
    const obj = Object.create(klass.prototype);
    obj.ptr = ptr;
    return obj;
  }

  static _assertClass(ptr, klass) {
    if (!(ptr instanceof klass)) {
      throw new Error(`expected instance of ${klass.name}`);
    }
    return ptr.ptr;
  }

  constructor() {
    throw new Error("Can't be initialized with constructor");
  }

  /**
  * Frees the pointer
  * @returns {Promise<void>}
  */
  async free() {
    if (!this.ptr) {
      return;
    }
    const ptr = this.ptr;
    this.ptr = null;
    await HaskellShelley.ptrFree(ptr);
  }
}

/**
* @param {TransactionHash} txBodyHash
* @param {ByronAddress} addr
* @param {Bip32PrivateKey} key
* @returns {Promise<BootstrapWitness>}
*/
export const make_icarus_bootstrap_witness = async (txBodyHash, addr, key) => {
  const txBodyHashPtr = Ptr._assertClass(txBodyHash, TransactionHash);
  const addrPtr = Ptr._assertClass(addr, ByronAddress);
  const keyPtr = Ptr._assertClass(key, Bip32PrivateKey);
  const ret = await HaskellShelley.makeIcarusBootstrapWitness(txBodyHashPtr, addrPtr, keyPtr);
  return Ptr._wrap(ret, BootstrapWitness);
};

/**
* @param {TransactionHash} txBodyHash
* @param {PrivateKey} sk
* @returns {Promise<Vkeywitness>}
*/
export const make_vkey_witness = async (txBodyHash, sk) => {
  const txBodyHashPtr = Ptr._assertClass(txBodyHash, TransactionHash);
  const skPtr = Ptr._assertClass(sk, PrivateKey);
  const ret = await HaskellShelley.makeVkeyWitness(txBodyHashPtr, skPtr);
  return Ptr._wrap(ret, Vkeywitness);
};

/**
* @param {Value} assets
* @param {BigNum} minUtxoVal
* @returns {Promise<BigNum>}
*/
export const min_ada_required = async (assets, minUtxoVal) => {
  const assetsPtr = Ptr._assertClass(assets, Value);
  const minUtxoValPtr = Ptr._assertClass(minUtxoVal, BigNum);
  const ret = await HaskellShelley.minAdaRequired(assetsPtr, minUtxoValPtr);
  return Ptr._wrap(ret, BigNum);
};

/**
* @param {string} json
* @param {MetadataJsonSchema} schema
* @returns {Promise<TransactionMetadatum>}
*/
export const encode_json_str_to_metadatum = async (json, schema) => {
  const ret = await HaskellShelley.encodeJsonStrToMetadatum(json, schema);
  return Ptr._wrap(ret, TransactionMetadatum);
};

/**
* @param {TransactionMetadatum} metadatum
* @param {MetadataJsonSchema} schema
* @returns {Promise<string>}
*/
export const decode_metadatum_to_json_str = async (metadatum, schema) => {
  const metadatumPtr = Ptr._assertClass(metadatum, TransactionMetadatum);
  return await HaskellShelley.decodeMetadatumToJsonStr(metadatumPtr, schema);
};

/**
* @param {TransactionBody} txBody
* @returns {Promise<TransactionHash>}
*/
export const hash_transaction = async (txBody) => {
  const txBodyPtr = Ptr._assertClass(txBody, TransactionBody);
  const ret = await HaskellShelley.hashTransaction(txBodyPtr);
  return Ptr._wrap(ret, TransactionHash);
};

export class BigNum extends Ptr {

  /**
  * @param {string} string
  * @returns {Promise<BigNum>}
  */
  static async from_str(string) {
    const ret = await HaskellShelley.bigNumFromStr(string);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * String representation of the BigNum value for use from environments
  * that don't support BigInt
  * @returns {Promise<string>}
  */
  async to_str() {
    return await HaskellShelley.bigNumToStr(this.ptr);
  }

  /**
  * @param {BigNum} other
  * @returns {Promise<BigNum>}
  */
  async checked_add(other) {
    const otherPtr = Ptr._assertClass(other, BigNum);
    const ret = await HaskellShelley.bigNumCheckedAdd(this.ptr, otherPtr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @param {BigNum} other
  * @returns {Promise<BigNum>}
  */
  async checked_sub(other) {
    const otherPtr = Ptr._assertClass(other, BigNum);
    const ret = await HaskellShelley.bigNumCheckedSub(this.ptr, otherPtr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @param {BigNum} other
  * @returns {Promise<BigNum>}
  */
  async clamped_sub(other) {
    const otherPtr = Ptr._assertClass(other, BigNum);
    const ret = await HaskellShelley.bigNumClampedSub(this.ptr, otherPtr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
   * @param {BigNum} rhs
   * @returns {Promise<number | undefined>}
   */
  async compare(rhs) {
    const rhsPtr = Ptr._assertClass(rhs, BigNum);
    return await HaskellShelley.bigNumCompare(this.ptr, rhsPtr);
  }
}

export const Coin = BigNum;

export class Value extends Ptr {

  /**
  * @param {BigNum} coin
  * @returns {Promise<Value>}
  */
  static async new(coin) {
    const coinPtr = Ptr._assertClass(coin, BigNum);
    const ret = await HaskellShelley.valueNew(coinPtr);
    return Ptr._wrap(ret, Value);
  }

  /**
  * TODO: should we return Coin instead?
  * @returns {Promise<BigNum>}
  */
  async coin() {
    const ret = await HaskellShelley.valueCoin(this.ptr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @param {BigNum} coin
  * @returns {Promise<void>}
  */
  async set_coin(coin) {
    // recall: we expose Coin as a reference to BigNum
    const coinPtr = Ptr._assertClass(coin, BigNum);
    return await HaskellShelley.valueSetCoin(this.ptr, coinPtr);
  }

  /**
  * @returns {Promise<MultiAsset | undefined>}
  */
  async multiasset() {
    const ret = await HaskellShelley.valueMultiasset(this.ptr);
    return Ptr._wrap(ret, MultiAsset);
  }

  /**
  * @param {MultiAsset} multiasset
  * @returns {Promise<void>}
  */
  async set_multiasset(multiasset) {
    const multiassetPtr = Ptr._assertClass(multiasset, MultiAsset);
    return await HaskellShelley.valueSetMultiasset(this.ptr, multiassetPtr);
  }

  /**
  * @param {Value} rhs
  * @returns {Promise<Value>}
  */
  async checked_add(rhs) {
    const rhsPtr = Ptr._assertClass(rhs, Value);
    const ret = await HaskellShelley.valueCheckedAdd(this.ptr, rhsPtr);
    return Ptr._wrap(ret, Value);
  }

  /**
  * @param {Value} rhs
  * @returns {Promise<Value>}
  */
  async checked_sub(rhs) {
    const rhsPtr = Ptr._assertClass(rhs, Value);
    const ret = await HaskellShelley.valueCheckedSub(this.ptr, rhsPtr);
    return Ptr._wrap(ret, Value);
  }

  /**
  * @param {Value} rhs
  * @returns {Promise<Value>}
  */
  async clamped_sub(rhs) {
    const rhsPtr = Ptr._assertClass(rhs, Value);
    const ret = await HaskellShelley.valueClampedSub(this.ptr, rhsPtr);
    return Ptr._wrap(ret, Value);
  }

  /**
   * @param {Value} rhs
   * @returns {Promise<number | undefined>}
   */
  async compare(rhs) {
    const rhsPtr = Ptr._assertClass(rhs, Value);
    return await HaskellShelley.valueCompare(this.ptr, rhsPtr);
  }
}

export class Int extends Ptr {
  /**
  * @param {BigNum} x
  * @returns {Promise<Int>}
  */
  static async new(x) {
    const ptr = Ptr._assertClass(x, BigNum);
    const ret = await HaskellShelley.intNew(ptr);
    return Ptr._wrap(ret, Int);
  }

  /**
  * @returns {Promise<number>}
  */
  async as_i32() {
    return await HaskellShelley.intAsi32(this.ptr);
  }
}

export class AssetName extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.assetNameToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<AssetName>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.assetNameFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, AssetName);
  }

  /**
  * @param {Uint8Array} name
  * @returns {Promise<AssetName>}
  */
  static async new(name) {
    const ret = await HaskellShelley.assetNameNew(b64FromUint8Array(name));
    return Ptr._wrap(ret, AssetName);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async name() {
    const b64 = await HaskellShelley.assetNameName(this.ptr);
    return Uint8ArrayFromB64(b64);
  }
}

export class AssetNames extends Ptr {
  /**
  * @returns {Promise<AssetNames>}
  */
  static async new() {
    const ret = await HaskellShelley.assetNamesNew();
    return Ptr._wrap(ret, AssetNames);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.assetNamesLen(this.ptr);
  }

  /**
  * @param {number} index
  * @returns {Promise<AssetName>}
  */
  async get(index) {
    const ret = await HaskellShelley.assetNamesGet(this.ptr, index);
    return Ptr._wrap(ret, AssetName);
  }

  /**
  * @param {AssetName} item
  * @returns {Promise<void>}
  */
  add(item) {
    const itemPtr = Ptr._assertClass(item, AssetName);
    return HaskellShelley.assetNamesAdd(this.ptr, itemPtr);
  }
}

/**
* ED25519 key used as public key
*/
export class PublicKey extends Ptr {
  /**
  * Get private key from its bech32 representation
  * Example:
  * ```javascript
  * const pkey = PublicKey.from_bech32("ed25519_pk1dgaagyh470y66p899txcl3r0jaeaxu6yd7z2dxyk55qcycdml8gszkxze2");
  * ```
  * @param {string} bech32_str
  * @returns {Promise<PublicKey>}
  */
  static async from_bech32(bech32_str) {
    const ret = await HaskellShelley.publicKeyFromBech32(bech32_str);
    return Ptr._wrap(ret, PublicKey);
  }

  /**
  * @returns {Promise<string>}
  */
  to_bech32() {
    return HaskellShelley.publicKeyToBech32(this.ptr);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<PublicKey>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.publicKeyFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, PublicKey);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async as_bytes() {
    const b64 = await HaskellShelley.publicKeyAsBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  // TODO
  // /**
  // * @param {Uint8Array} data
  // * @param {Ed25519Signature} signature
  // * @returns {Promise<boolean>}
  // */
  // static async verify(data, signature) {
  //   const signaturePtr = Ptr._assertClass(signature, Ed25519Signature);
  //   return HaskellShelley.publicKeyVerify(b64FromUint8Array(data), signaturePtr);
  // }

  /**
  * @returns {Promise<Ed25519KeyHash>}
  */
  async hash() {
    const ret = await HaskellShelley.publicKeyHash(this.ptr);
    return Ptr._wrap(ret, Ed25519KeyHash);
  }
}

export class PrivateKey extends Ptr {
  /**
  * @returns {Promise<PublicKey>}
  */
  async to_public() {
    const ret = await HaskellShelley.privateKeyToPublic(this.ptr);
    return Ptr._wrap(ret, PublicKey);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<PrivateKey>}
  */
  static async from_normal_bytes(bytes) {
    const ret = await HaskellShelley.privateKeyFromNormalBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, PrivateKey);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async as_bytes() {
    const b64 = await HaskellShelley.privateKeyAsBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<PrivateKey>}
  */
  static async from_extended_bytes(bytes) {
    const ret = await HaskellShelley.privateKeyFromExtendedBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, PrivateKey);
  }

  /**
  * @param {Uint8Array} message
  * @returns {Promise<Ed25519Signature>}
  */
  async sign(message) {
    const ret = await HaskellShelley.privateKeySign(this.ptr, b64FromUint8Array(message));
    return Ptr._wrap(ret, Ed25519Signature);
  }
}

export class Bip32PublicKey extends Ptr {
  /**
  * derive this private key with the given index.
  *
  * # Security considerations
  *
  * * hard derivation index cannot be soft derived with the public key
  *
  * # Hard derivation vs Soft derivation
  *
  * If you pass an index below 0x80000000 then it is a soft derivation.
  * The advantage of soft derivation is that it is possible to derive the
  * public key too. I.e. derivation the private key with a soft derivation
  * index and then retrieving the associated public key is equivalent to
  * deriving the public key associated to the parent private key.
  *
  * Hard derivation index does not allow public key derivation.
  *
  * This is why deriving the private key should not fail while deriving
  * the public key may fail (if the derivation index is invalid).
  * @param {number} index
  * @returns {Promise<Bip32PublicKey>}
  */
  async derive(index) {
    const ret = await HaskellShelley.bip32PublicKeyDerive(this.ptr, index);
    return Ptr._wrap(ret, Bip32PublicKey);
  }

  /**
  * @returns {Promise<PublicKey>}
  */
  async to_raw_key() {
    const ret = await HaskellShelley.bip32PublicKeyToRawKey(this.ptr);
    return Ptr._wrap(ret, PublicKey);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Bip32PublicKey>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.bip32PublicKeyFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, Bip32PublicKey);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async as_bytes() {
    const b64 = await HaskellShelley.bip32PublicKeyAsBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {string} bech32Str
  * @returns {Promise<Bip32PublicKey>}
  */
  static async from_bech32(bech32Str) {
    const ret = await HaskellShelley.bip32PublicKeyFromBech32(bech32Str);
    return Ptr._wrap(ret, Bip32PublicKey);
  }

  /**
  * @returns {Promise<string>}
  */
  to_bech32() {
    return HaskellShelley.bip32PublicKeyToBech32(this.ptr);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async chaincode() {
    const b64 = await  HaskellShelley.bip32PublicKeyChaincode(this.ptr);
    return Uint8ArrayFromB64(b64);
  }
}


/**
*/
export class Bip32PrivateKey extends Ptr {
  /**
  * derive this private key with the given index.
  *
  * # Security considerations
  *
  * * hard derivation index cannot be soft derived with the public key
  *
  * # Hard derivation vs Soft derivation
  *
  * If you pass an index below 0x80000000 then it is a soft derivation.
  * The advantage of soft derivation is that it is possible to derive the
  * public key too. I.e. derivation the private key with a soft derivation
  * index and then retrieving the associated public key is equivalent to
  * deriving the public key associated to the parent private key.
  *
  * Hard derivation index does not allow public key derivation.
  *
  * This is why deriving the private key should not fail while deriving
  * the public key may fail (if the derivation index is invalid).
  * @param {number} index
  * @returns {Promise<Bip32PrivateKey>}
  */
  async derive(index) {
    const ret = await HaskellShelley.bip32PrivateKeyDerive(this.ptr, index);
    return Ptr._wrap(ret, Bip32PrivateKey);
  }

  /**
  * @returns {Promise<Bip32PrivateKey>}
  */
  static async generate_ed25519_bip32() {
    const ret = await HaskellShelley.bip32PrivateKeyGenerateEd25519Bip32();
    return Ptr._wrap(ret, Bip32PrivateKey);
  }

  /**
  * @returns {Promise<PrivateKey>}
  */
  async to_raw_key() {
    const ret = await HaskellShelley.bip32PrivateKeyToRawKey(this.ptr);
    return Ptr._wrap(ret, PrivateKey);
  }

  /**
  * @returns {Promise<Bip32PublicKey>}
  */
  async to_public() {
    const ret = await HaskellShelley.bip32PrivateKeyToPublic(this.ptr);
    return Ptr._wrap(ret, Bip32PublicKey);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Bip32PrivateKey>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.bip32PrivateKeyFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, Bip32PrivateKey);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async as_bytes() {
    const b64 = await HaskellShelley.bip32PrivateKeyAsBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {string} bech32Str
  * @returns {Promise<Bip32PrivateKey>}
  */
  static async from_bech32(bech32Str) {
    const ret = await HaskellShelley.bip32PrivateKeyFromBech32(bech32Str);
    return Ptr._wrap(ret, Bip32PrivateKey);
  }

  /**
  * @returns {Promise<string>}
  */
  to_bech32() {
    return HaskellShelley.bip32PrivateKeyToBech32(this.ptr);
  }

  /**
  * @param {Uint8Array} entropy
  * @param {Uint8Array} password
  * @returns {Promise<Bip32PrivateKey>}
  */
  static async from_bip39_entropy(entropy, password) {
    const ret = await HaskellShelley.bip32PrivateKeyFromBip39Entropy(b64FromUint8Array(entropy), b64FromUint8Array(password));
    return Ptr._wrap(ret, Bip32PrivateKey);
  }
}

export class ByronAddress extends Ptr {
  /**
  * @returns {Promise<string>}
  */
  async to_base58() {
    return HaskellShelley.byronAddressToBase58(this.ptr);
  }

  /**
  * @param {string} string
  * @returns {Promise<ByronAddress>}
  */
  static async from_base58(string) {
    const ret = await HaskellShelley.byronAddressFromBase58(string);
    return Ptr._wrap(ret, ByronAddress);
  }

  /**
  * @param {string} string
  * @returns {Promise<boolean>}
  */
  static async is_valid(string) {
    return HaskellShelley.byronAddressIsValid(string);
  }

  /**
  * @returns {Promise<Address>}
  */
  async to_address() {
    const ret = await HaskellShelley.byronAddressToAddress(this.ptr);
    return Ptr._wrap(ret, Address);
  }

  /**
  * @param {Address} addr
  * @returns {Promise<ByronAddress | undefined>}
  */
  static async from_address(addr) {
    const addrPtr = Ptr._assertClass(addr, Address);
    const ret = await HaskellShelley.byronAddressFromAddress(addrPtr);
    return Ptr._wrap(ret, ByronAddress);
  }

  /**
  * @returns {Promise<number>}
  */
  byron_protocol_magic() {
    return HaskellShelley.byronAddressByronProtocolMagic(this.ptr);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async attributes() {
    const b64 = await  HaskellShelley.byronAddressAttributes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }
}

export class Address extends Ptr {

  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.addressToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Address>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.addressFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, Address);
  }

  /**
  * @param {string | void} prefix
  * @returns {Promise<string>}
  */
  to_bech32(prefix) {
    if (prefix == null)
      return HaskellShelley.addressToBech32(this.ptr);
    return HaskellShelley.addressToBech32WithPrefix(this.ptr, prefix);
  }

  /**
  * @param {string} string
  * @returns {Promise<Address>}
  */
  static async from_bech32(string) {
    const ret = await HaskellShelley.addressFromBech32(string);
    return Ptr._wrap(ret, Address);
  }

  /**
  * @returns {Promise<number>}
  */
  network_id() {
    return HaskellShelley.addressNetworkId(this.ptr);
  }
}

export class Ed25519Signature extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.ed25519SignatureToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Ed25519Signature>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.ed25519SignatureFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, Ed25519Signature);
  }

  /**
  * @returns {Promise<string>}
  */
  async to_hex() {
    return await HaskellShelley.ed25519SignatureToHex(this.ptr);
  }
}

export class Ed25519KeyHash extends Ptr {

  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.ed25519KeyHashToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Ed25519KeyHash>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.ed25519KeyHashFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, Ed25519KeyHash);
  }
}

export class ScriptHash extends Ptr {

  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.scriptHashToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<ScriptHash>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.scriptHashFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, ScriptHash);
  }
}

export class ScriptHashes extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.scriptHashesToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<ScriptHashes>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.scriptHashesFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, ScriptHashes);
  }

  /**
  * @returns {Promise<ScriptHashes>}
  */
  static async new() {
    const ret = await HaskellShelley.scriptHashesNew();
    return Ptr._wrap(ret, ScriptHashes);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.scriptHashesLen(this.ptr);
  }

  /**
  * @param {number} index
  * @returns {Promise<ScriptHash>}
  */
  async get(index) {
    const ret = await HaskellShelley.scriptHashesGet(this.ptr, index);
    return Ptr._wrap(ret, ScriptHash);
  }

  /**
  * @param {ScriptHash} item
  * @returns {Promise<void>}
  */
  add(item) {
    const itemPtr = Ptr._assertClass(item, ScriptHash);
    return HaskellShelley.scriptHashesAdd(this.ptr, itemPtr);
  }
}

/**
 * PolicyID is defined in rust as:
 *   pub type PolicyID = ScriptHash
 * so we just expose a reference to ScriptHash
 */
export const PolicyID = ScriptHash;

export const PolicyIDs = ScriptHashes;

export class Assets extends Ptr {
  /**
  * @returns {Promise<Assets>}
  */
  static async new() {
    const ret = await HaskellShelley.assetsNew();
    return Ptr._wrap(ret, Assets);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.assetsLen(this.ptr);
  }

  /**
  * @param {AssetName} key
  * @param {BigNum} value
  * @returns {Promise<BigNum>}
  */
  async insert(key, value) {
    const keyPtr = Ptr._assertClass(key, AssetName);
    const valuePtr = Ptr._assertClass(value, BigNum);
    const ret = await HaskellShelley.assetsInsert(this.ptr, keyPtr, valuePtr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @param {AssetName} key
  * @returns {Promise<BigNum | undefined>}
  */
  async get(key) {
    const keyPtr = Ptr._assertClass(key, AssetName);
    const ret = await HaskellShelley.assetsGet(this.ptr, keyPtr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @returns {Promise<AssetNames>}
  */
  async keys() {
    const ret = await HaskellShelley.assetsKeys(this.ptr);
    return Ptr._wrap(ret, AssetNames);
  }
}

export class MultiAsset extends Ptr {
  /**
  * @returns {Promise<MultiAsset>}
  */
  static async new() {
    const ret = await HaskellShelley.multiAssetNew();
    return Ptr._wrap(ret, MultiAsset);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.multiAssetLen(this.ptr);
  }

  /**
  * @param {PolicyID} key
  * @param {Assets} value
  * @returns {Promise<Assets>}
  */
  async insert(key, value) {
    // recall: PolicyID is a reference to ScriptHash
    const keyPtr = Ptr._assertClass(key, ScriptHash);
    const valuePtr = Ptr._assertClass(value, Assets);
    const ret = await HaskellShelley.multiAssetInsert(this.ptr, keyPtr, valuePtr);
    return Ptr._wrap(ret, Assets);
  }

  /**
  * @param {PolicyID} key
  * @returns {Promise<Assets | undefined>}
  */
  async get(key) {
    const keyPtr = Ptr._assertClass(key, PolicyID);
    const ret = await HaskellShelley.multiAssetGet(this.ptr, keyPtr);
    return Ptr._wrap(ret, Assets);
  }

  /**
  * @returns {Promise<PolicyIDs>}
  */
  async keys() {
    const ret = await HaskellShelley.multiAssetKeys(this.ptr);
    return Ptr._wrap(ret, PolicyIDs);
  }

  /**
  * @param {MultiAsset} rhs
  * @returns {Promise<MultiAsset>}
  */
  async sub(rhs) {
    const rhsPtr = Ptr._assertClass(rhs, MultiAsset);
    const ret = await HaskellShelley.multiAssetSub(this.ptr, rhsPtr);
    return Ptr._wrap(ret, MultiAsset);
  }
}

export class TransactionHash extends Ptr {

  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.transactionHashToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionHash>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.transactionHashFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, TransactionHash);
  }
}

export class StakeCredential extends Ptr {
  /**
  * @param {Ed25519KeyHash} hash
  * @returns {Promise<StakeCredential>}
  */
  static async from_keyhash(hash) {
    const keyHashPtr = Ptr._assertClass(hash, Ed25519KeyHash);
    const ret = await HaskellShelley.stakeCredentialFromKeyHash(keyHashPtr);
    return Ptr._wrap(ret, StakeCredential);
  }

  /**
  * @param {ScriptHash} hash
  * @returns {Promise<StakeCredential>}
  */
  static async from_scripthash(hash) {
    const scriptHashPtr = Ptr._assertClass(hash, ScriptHash);
    const ret = await HaskellShelley.stakeCredentialFromScriptHash(scriptHashPtr);
    return Ptr._wrap(ret, StakeCredential);
  }

  /**
  * @returns {Promise<Ed25519KeyHash | undefined>}
  */
  async to_keyhash() {
    const ret = await HaskellShelley.stakeCredentialToKeyHash(this.ptr);
    return Ptr._wrap(ret, Ed25519KeyHash);
  }

  /**
  * @returns {Promise<ScriptHash | undefined>}
  */
  async to_scripthash() {
    const ret = await HaskellShelley.stakeCredentialToScriptHash(this.ptr);
    return Ptr._wrap(ret, ScriptHash);
  }

  /**
  * @returns {Promise<number>}
  */
  async kind() {
    return await HaskellShelley.stakeCredentialKind(this.ptr);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.stakeCredentialToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<StakeCredential>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.stakeCredentialFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, StakeCredential);
  }
}

export class StakeRegistration extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.stakeRegistrationToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<StakeRegistration>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.stakeRegistrationFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, StakeRegistration);
  }

  /**
  * @returns {Promise<StakeCredential>}
  */
  async stake_credential() {
    const ret = await HaskellShelley.stakeRegistrationStakeCredential(this.ptr);
    return Ptr._wrap(ret, StakeCredential);
  }

  /**
  * @param {StakeCredential} stakeCredential
  * @returns {Promise<StakeRegistration>}
  */
  static async new(stakeCredential) {
    const stakeCredentialPtr = Ptr._assertClass(stakeCredential, StakeCredential);
    const ret = await HaskellShelley.stakeRegistrationNew(stakeCredentialPtr);
    return Ptr._wrap(ret, StakeRegistration);
  }
}

export class StakeDeregistration extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.stakeDeregistrationToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<StakeDeregistration>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.stakeDeregistrationFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, StakeDeregistration);
  }

  /**
  * @returns {Promise<StakeCredential>}
  */
  async stake_credential() {
    const ret = await HaskellShelley.stakeDeregistrationStakeCredential(this.ptr);
    return Ptr._wrap(ret, StakeCredential);
  }

  /**
  * @param {StakeCredential} stakeCredential
  * @returns {Promise<StakeDeregistration>}
  */
  static async new(stakeCredential) {
    const stakeCredentialPtr = Ptr._assertClass(stakeCredential, StakeCredential);
    const ret = await HaskellShelley.stakeDeregistrationNew(stakeCredentialPtr);
    return Ptr._wrap(ret, StakeDeregistration);
  }
}

export class StakeDelegation extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.stakeDelegationToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<StakeDelegation>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.stakeDelegationFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, StakeDelegation);
  }

  /**
  * @returns {Promise<StakeCredential>}
  */
  async stake_credential() {
    const ret = await HaskellShelley.stakeDelegationStakeCredential(this.ptr);
    return Ptr._wrap(ret, StakeCredential);
  }

  /**
  * @returns {Promise<Ed25519KeyHash>}
  */
  async pool_keyhash() {
    const ret = await HaskellShelley.stakeDelegationPoolKeyhash(this.ptr);
    return Ptr._wrap(ret, Ed25519KeyHash);
  }

  /**
  * @param {StakeCredential} stakeCredential
  * @param {Ed25519KeyHash} poolKeyHash
  * @returns {Promise<StakeDelegation>}
  */
  static async new(stakeCredential, poolKeyHash) {
    const stakeCredentialPtr = Ptr._assertClass(stakeCredential, StakeCredential);
    const poolKeyHashPtr = Ptr._assertClass(poolKeyHash, Ed25519KeyHash);
    const ret = await HaskellShelley.stakeDelegationNew(stakeCredentialPtr, poolKeyHashPtr);
    return Ptr._wrap(ret, StakeDelegation);
  }
}

export class Certificate extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.certificateToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Certificate>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.certificateFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, Certificate);
  }

  /**
  * @param {StakeRegistration} stakeRegistration
  * @returns {Promise<Certificate>}
  */
  static async new_stake_registration(stakeRegistration) {
    const stakeRegistrationPtr = Ptr._assertClass(stakeRegistration, StakeRegistration);
    const ret = await HaskellShelley.certificateNewStakeRegistration(stakeRegistrationPtr);
    return Ptr._wrap(ret, Certificate);
  }

  /**
  * @param {StakeDeregistration} stakeDeregistration
  * @returns {Promise<Certificate>}
  */
  static async new_stake_deregistration(stakeDeregistration) {
    const stakeDeregistrationPtr = Ptr._assertClass(stakeDeregistration, StakeDeregistration);
    const ret = await HaskellShelley.certificateNewStakeDeregistration(stakeDeregistrationPtr);
    return Ptr._wrap(ret, Certificate);
  }

  /**
  * @param {StakeDelegation} stakeDelegation
  * @returns {Promise<Certificate>}
  */
  static async new_stake_delegation(stakeDelegation) {
    const stakeDelegationPtr = Ptr._assertClass(stakeDelegation, StakeDelegation);
    const ret = await HaskellShelley.certificateNewStakeDelegation(stakeDelegationPtr);
    return Ptr._wrap(ret, Certificate);
  }

  /**
  * @returns {Promise<StakeRegistration | undefined>}
  */
  async as_stake_registration() {
    const ret = await HaskellShelley.certificateAsStakeRegistration(this.ptr);
    return Ptr._wrap(ret, StakeRegistration);
  }

  /**
  * @returns {Promise<StakeDeregistration | undefined>}
  */
  async as_stake_deregistration() {
    const ret = await HaskellShelley.certificateAsStakeDeregistration(this.ptr);
    return Ptr._wrap(ret, StakeDeregistration);
  }

  /**
  * @returns {Promise<StakeDelegation | undefined>}
  */
  async as_stake_delegation() {
    const ret = await HaskellShelley.certificateAsStakeDelegation(this.ptr);
    return Ptr._wrap(ret, StakeDelegation);
  }
}

export class Certificates extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.certificatesToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Certificates>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.certificatesFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, Certificates);
  }

  /**
  * @returns {Promise<Certificates>}
  */
  static async new() {
    const ret = await HaskellShelley.certificatesNew();
    return Ptr._wrap(ret, Certificates);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.certificatesLen(this.ptr);
  }

  /**
  * @param {number} index
  * @returns {Promise<Certificate>}
  */
  async get(index) {
    const ret = await HaskellShelley.certificatesGet(this.ptr, index);
    return Ptr._wrap(ret, Certificate);
  }

  /**
  * @param {Certificate} item
  * @returns {Promise<void>}
  */
  add(item) {
    const itemPtr = Ptr._assertClass(item, Certificate);
    return HaskellShelley.certificatesAdd(this.ptr, itemPtr);
  }
}

export class BaseAddress extends Ptr {
  /**
  * @param {number} network
  * @param {StakeCredential} payment
  * @param {StakeCredential} stake
  * @returns {Promise<BaseAddress>}
  */
  static async new(network, payment, stake) {
    const paymentPtr = Ptr._assertClass(payment, StakeCredential);
    const stakePtr = Ptr._assertClass(stake, StakeCredential);
    const ret = await HaskellShelley.baseAddressNew(network, paymentPtr, stakePtr);
    return Ptr._wrap(ret, BaseAddress);
  }

  /**
  * @returns {Promise<StakeCredential>}
  */
  async payment_cred() {
    const ret = await HaskellShelley.baseAddressPaymentCred(this.ptr);
    return Ptr._wrap(ret, StakeCredential);
  }

  /**
  * @returns {Promise<StakeCredential>}
  */
  async stake_cred() {
    const ret = await HaskellShelley.baseAddressStakeCred(this.ptr);
    return Ptr._wrap(ret, StakeCredential);
  }

  /**
  * @returns {Promise<Address>}
  */
  async to_address() {
    const ret = await HaskellShelley.baseAddressToAddress(this.ptr);
    return Ptr._wrap(ret, Address);
  }

  /**
  * @param {Address} addr
  * @returns {Promise<BaseAddress | undefined>}
  */
  static async from_address(addr) {
    const addrPtr = Ptr._assertClass(addr, Address);
    const ret = await HaskellShelley.baseAddressFromAddress(addrPtr);
    return Ptr._wrap(ret, BaseAddress);
  }
}

export class RewardAddress extends Ptr {
  /**
  * @param {number} network
  * @param {StakeCredential} payment
  * @returns {Promise<RewardAddress>}
  */
  static async new(network, payment) {
    const paymentPtr = Ptr._assertClass(payment, StakeCredential);
    const ret = await HaskellShelley.rewardAddressNew(network, paymentPtr);
    return Ptr._wrap(ret, RewardAddress);
  }

  /**
  * @returns {Promise<StakeCredential>}
  */
  async payment_cred() {
    const ret = await HaskellShelley.rewardAddressPaymentCred(this.ptr);
    return Ptr._wrap(ret, StakeCredential);
  }

  /**
  * @returns {Promise<Address>}
  */
  async to_address() {
    const ret = await HaskellShelley.rewardAddressToAddress(this.ptr);
    return Ptr._wrap(ret, Address);
  }

  /**
  * @param {Address} addr
  * @returns {Promise<RewardAddress | undefined>}
  */
  static async from_address(addr) {
    const addrPtr = Ptr._assertClass(addr, Address);
    const ret = await HaskellShelley.rewardAddressFromAddress(addrPtr);
    return Ptr._wrap(ret, RewardAddress);
  }
}

export class RewardAddresses extends Ptr {
  /**
  * @returns {Promise<RewardAddresses>}
  */
  static async new() {
    const ret = await HaskellShelley.rewardAddressesNew();
    return Ptr._wrap(ret, RewardAddresses);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.rewardAddressesLen(this.ptr);
  }

  /**
  * @param {number} index
  * @returns {Promise<RewardAddress>}
  */
  async get(index) {
    const ret = await HaskellShelley.rewardAddressesGet(this.ptr, index);
    return Ptr._wrap(ret, RewardAddress);
  }

  /**
  * @param {RewardAddress} item
  * @returns {Promise<void>}
  */
  async add(item) {
    const itemPtr = Ptr._assertClass(item, RewardAddress);
    return HaskellShelley.rewardAddressesAdd(this.ptr, itemPtr);
  }
}

export class UnitInterval extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.unitIntervalToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<UnitInterval>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.unitIntervalFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, UnitInterval);
  }

  /**
  * @param {BigNum} numerator
  * @param {BigNum} denominator
  * @returns {Promise<UnitInterval>}
  */
  static async new(numerator, denominator) {
    const numeratorPtr = Ptr._assertClass(numerator, BigNum);
    const denominatorPtr = Ptr._assertClass(denominator, BigNum);
    const ret = await HaskellShelley.unitIntervalNew(numeratorPtr, denominatorPtr);
    return Ptr._wrap(ret, UnitInterval);
  }
}


export class TransactionInput extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.transactionInputToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionInput>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.transactionInputFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, TransactionInput);
  }

  /**
  * @returns {Promise<TransactionHash>}
  */
  async transaction_id() {
    const ret = await HaskellShelley.transactionInputTransactionId(this.ptr);
    return Ptr._wrap(ret, TransactionHash);
  }

  /**
  * @returns {Promise<number>}
  */
  async index() {
    return await HaskellShelley.transactionInputIndex(this.ptr);
  }

  /**
  * @param {TransactionHash} transactionId
  * @param {TransactionIndex} index
  * @returns {Promise<TransactionInput>}
  */
  static async new(transactionId, index) {
    const transactionIdPtr = Ptr._assertClass(transactionId, TransactionHash);
    const ret = await HaskellShelley.transactionInputNew(transactionIdPtr, index);
    return Ptr._wrap(ret, TransactionInput);
  }
}

export class TransactionInputs extends Ptr {
  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.transactionInputsLen(this.ptr);
  }

  /**
  * @param {number} index
  * @returns {Promise<TransactionInput>}
  */
  async get(index) {
    const ret = await HaskellShelley.transactionInputsGet(this.ptr, index);
    return Ptr._wrap(ret, TransactionInput);
  }
}
export class TransactionOutput extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.transactionOutputToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionOutput>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.transactionOutputFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, TransactionOutput);
  }

  /**
  * @param {Address} address
  * @param {BigNum} amount
  * @returns {Promise<TransactionOutput>}
  */
  static async new(address, amount) {
    const addrPtr = Ptr._assertClass(address, Address);
    const amountPtr = Ptr._assertClass(amount, Value);
    const ret = await HaskellShelley.transactionOutputNew(addrPtr, amountPtr);
    return Ptr._wrap(ret, TransactionOutput);
  }

  /**
  * @returns {Promise<Address>}
  */
  async address() {
    const ret = await HaskellShelley.transactionOutputAddress(this.ptr);
    return Ptr._wrap(ret, Address);
  }

  /**
  * @returns {Promise<BigNum>}
  */
  async amount() {
    const ret = await HaskellShelley.transactionOutputAmount(this.ptr);
    return Ptr._wrap(ret, Value);
  }
}

export class TransactionOutputs extends Ptr {
  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.transactionOutputsLen(this.ptr);
  }

  /**
  * @param {number} index
  * @returns {Promise<TransactionOutput>}
  */
  async get(index) {
    const ret = await HaskellShelley.transactionOutputsGet(this.ptr, index);
    return Ptr._wrap(ret, TransactionOutput);
  }
}

export class LinearFee extends Ptr {
  /**
  * @returns {Promise<BigNum>}
  */
  async constant() {
    const ret = await HaskellShelley.linearFeeConstant(this.ptr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @returns {Promise<BigNum>}
  */
  async coefficient() {
    const ret = await HaskellShelley.linearFeeCoefficient(this.ptr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @param {BigNum} coefficient
  * @param {BigNum} constant
  * @returns {Promise<LinearFee>}
  */
  static async new(coefficient, constant) {
    const coeffPtr = Ptr._assertClass(coefficient, BigNum);
    const constPtr = Ptr._assertClass(constant, BigNum);
    const ret = await HaskellShelley.linearFeeNew(coeffPtr, constPtr);
    return Ptr._wrap(ret, LinearFee);
  }
}

export class Vkey extends Ptr {
  /**
  * @param {PublicKey} pk
  * @returns {Promise<Vkey>}
  */
  static async new(pk) {
    const pkPtr = Ptr._assertClass(pk, PublicKey);
    const ret = await HaskellShelley.vkeyNew(pkPtr);
    return Ptr._wrap(ret, Vkey);
  }
}

export class Vkeywitness extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.vkeywitnessToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Vkeywitness>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.vkeywitnessFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, Vkeywitness);
  }

  /**
  * @param {Vkey} vkey
  * @param {Ed25519Signature} signature
  * @returns {Promise<Vkeywitness>}
  */
  static async new(vkey, signature) {
    const vkeyPtr = Ptr._assertClass(vkey, Vkey);
    const signaturePtr = Ptr._assertClass(signature, Ed25519Signature);
    const ret = await HaskellShelley.vkeywitnessNew(vkeyPtr, signaturePtr);
    return Ptr._wrap(ret, Vkeywitness);
  }

  /**
  * @returns {Promise<Ed25519Signature>}
  */
  async signature() {
    const ret = await HaskellShelley.vkeywitnessSignature(this.ptr);
    return Ptr._wrap(ret, Ed25519Signature);
  }
}

export class Vkeywitnesses extends Ptr {
  /**
  * @returns {Promise<Vkeywitnesses>}
  */
  static async new() {
    const ret = await HaskellShelley.vkeywitnessesNew();
    return Ptr._wrap(ret, Vkeywitnesses);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.vkeywitnessesLen(this.ptr);
  }

  /**
  * @param {Vkeywitness} item
  * @returns {Promise<void>}
  */
  async add(item) {
    const itemPtr = Ptr._assertClass(item, Vkeywitness);
    return HaskellShelley.vkeywitnessesAdd(this.ptr, itemPtr);
  }
}

export class BootstrapWitness extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.bootstrapWitnessToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<BootstrapWitness>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.bootstrapWitnessFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, BootstrapWitness);
  }

  /**
  * @param {Vkey} vkey
  * @param {Ed25519Signature} signature
  * @param {Uint8Array} chainCode
  * @param {Uint8Array} attributes
  * @returns {Promise<BootstrapWitness>}
  */
  static async new(vkey, signature, chainCode, attributes) {
    const vkeyPtr = Ptr._assertClass(vkey, Vkey);
    const signaturePtr = Ptr._assertClass(signature, Ed25519Signature);
    const ret = await HaskellShelley.bootstrapWitnessNew(
      vkeyPtr,
      signaturePtr,
      b64FromUint8Array(chainCode),
      b64FromUint8Array(attributes),
    );
    return Ptr._wrap(ret, BootstrapWitness);
  }
}

export class BootstrapWitnesses extends Ptr {
  /**
  * @returns {Promise<BootstrapWitnesses>}
  */
  static async new() {
    const ret = await HaskellShelley.bootstrapWitnessesNew();
    return Ptr._wrap(ret, BootstrapWitnesses);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.bootstrapWitnessesLen(this.ptr);
  }

  /**
  * @param {BootstrapWitness} item
  * @returns {Promise<void>}
  */
  async add(item) {
    const itemPtr = Ptr._assertClass(item, BootstrapWitness);
    return HaskellShelley.bootstrapWitnessesAdd(this.ptr, itemPtr);
  }
}

export class TransactionWitnessSet extends Ptr {
  /**
  * @returns {Promise<TransactionWitnessSet>}
  */
  static async new() {
    const ret = await HaskellShelley.transactionWitnessSetNew();
    return Ptr._wrap(ret, TransactionWitnessSet);
  }

  /**
  * @param {BootstrapWitnesses} bootstraps
  * @returns {Promise<void>}
  */
  async set_bootstraps(bootstraps) {
    const bootstrapsPtr = Ptr._assertClass(bootstraps, BootstrapWitnesses);
    return HaskellShelley.transactionWitnessSetSetBootstraps(this.ptr, bootstrapsPtr);
  }

  /**
  * @param {Vkeywitnesses} vkeys
  * @returns {Promise<void>}
  */
  async set_vkeys(vkeys) {
    const vkeysPtr = Ptr._assertClass(vkeys, Vkeywitnesses);
    return HaskellShelley.transactionWitnessSetSetVkeys(this.ptr, vkeysPtr);
  }
}

export class ScriptPubkey extends Ptr {
  /**
  * @returns {Promise<Ed25519KeyHash>}
  */
  async addr_keyhash() {
    const ret = await HaskellShelley.scriptPubkeyAddrKeyhash(this.ptr);
    return Ptr._wrap(ret, Ed25519KeyHash);
  }

  /**
  * @param {Ed25519KeyHash} addrKeyhash
  * @returns {Promise<ScriptPubkey>}
  */
  static async new(addrKeyhash) {
    const keyHashPtr = Ptr._assertClass(hash, Ed25519KeyHash);
    const ret = await HaskellShelley.scriptPubkeyNew(keyHashPtr);
    return Ptr._wrap(ret, ScriptPubkey);
  }
}

export class TransactionBody extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.transactionBodyToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionBody>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.transactionBodyFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, TransactionBody);
  }

  /**
  * @returns {Promise<TransactionInputs>}
  */
  async inputs() {
    const ret = await HaskellShelley.transactionBodyInputs(this.ptr);
    return Ptr._wrap(ret, TransactionInputs);
  }

  /**
  * @returns {Promise<BigNum>}
  */
  async fee() {
    const ret = await HaskellShelley.transactionBodyFee(this.ptr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @returns {Promise<Optional<number>>}
  */
  async ttl() {
    return HaskellShelley.transactionBodyTtl(this.ptr);
  }

  /**
  * @returns {Promise<TransactionOutputs>}
  */
  async outputs() {
    const ret = await HaskellShelley.transactionBodyOutputs(this.ptr);
    return Ptr._wrap(ret, TransactionOutputs);
  }

  /**
  * @returns {Promise<Certificates>}
  */
  async certs() {
    const ret = await HaskellShelley.transactionBodyCerts(this.ptr);
    return Ptr._wrap(ret, Certificates);
  }

  /**
  * @returns {Promise<Withdrawals>}
  */
  async withdrawals() {
    const ret = await HaskellShelley.transactionBodyWithdrawals(this.ptr);
    return Ptr._wrap(ret, Withdrawals);
  }
}

export class Transaction extends Ptr {
  /**
  * @returns {Promise<TransactionBody>}
  */
  async body() {
    const ret = await HaskellShelley.transactionBody(this.ptr);
    return Ptr._wrap(ret, TransactionBody);
  }
  /**
  * @param {TransactionBody} body
  * @param {TransactionWitnessSet} witnessSet
  * @param {TransactionMetadata | void} metadata
  * @returns {Promise<Transaction>}
  */
  static async new(body, witnessSet, metadata) {
    const bodyPtr = Ptr._assertClass(body, TransactionBody);
    const witnessSetPtr = Ptr._assertClass(witnessSet, TransactionWitnessSet);
    let ret;
    if (metadata == null) {
      ret = await HaskellShelley.transactionNew(bodyPtr, witnessSetPtr);
    } else {
      const metadataPtr = Ptr._assertClass(metadata, TransactionMetadata);
      ret = await HaskellShelley.transactionNewWithMetadata(bodyPtr, witnessSetPtr, metadataPtr);
    }
    return Ptr._wrap(ret, Transaction);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.transactionToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Transaction>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.transactionFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, Transaction);
  }
}

export class TransactionBuilder extends Ptr {
  /**
  * @param {Ed25519KeyHash} hash
  * @param {TransactionInput} input
  * @param {Value} amount
  * @returns {Promise<void>}
  */
  async add_key_input(hash, input, amount) {
    const hashPtr = Ptr._assertClass(hash, Ed25519KeyHash);
    const inputPtr = Ptr._assertClass(input, TransactionInput);
    const amountPtr = Ptr._assertClass(amount, Value);
    return HaskellShelley.transactionBuilderAddKeyInput(
      this.ptr,
      hashPtr,
      inputPtr,
      amountPtr,
    );
  }

  // TODO
  // async add_script_input()

  /**
  * @param {ByronAddress} hash
  * @param {TransactionInput} input
  * @param {Value} amount
  * @returns {Promise<void>}
  */
  async add_bootstrap_input(
    hash,
    input,
    amount,
  ) {
    const hashPtr = Ptr._assertClass(hash, ByronAddress);
    const inputPtr = Ptr._assertClass(input, TransactionInput);
    const amountPtr = Ptr._assertClass(amount, Value);
    return HaskellShelley.transactionBuilderAddBootstrapInput(
      this.ptr,
      hashPtr,
      inputPtr,
      amountPtr,
    );
  }

  /**
  * @param {Address} address
  * @param {TransactionInput} input
  * @param {Value} amount
  * @returns {Promise<void>}
  */
  async add_input(
    address,
    input,
    amount,
  ) {
    const addressPtr = Ptr._assertClass(address, Address);
    const inputPtr = Ptr._assertClass(input, TransactionInput);
    const amountPtr = Ptr._assertClass(amount, Value);
    return HaskellShelley.transactionBuilderAddInput(
      this.ptr,
      addressPtr,
      inputPtr,
      amountPtr,
    );
  }

  /**
  * note: specs return Coin
  * @param {Address} address
  * @param {TransactionInput} input
  * @param {Value} amount
  * @returns {Promise<BigNum>}
  */
  async fee_for_input(address, input, amount) {
    const addressPtr = Ptr._assertClass(address, Address);
    const inputPtr = Ptr._assertClass(input, TransactionInput);
    const amountPtr = Ptr._assertClass(amount, Value);
    const ret = await HaskellShelley.transactionBuilderFeeForInput(
      this.ptr,
      addressPtr,
      inputPtr,
      amountPtr,
    );
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @param {TransactionOutput} output
  * @returns {Promise<void>}
  */
  async add_output(output) {
    const outputPtr = Ptr._assertClass(output, TransactionOutput);
    return HaskellShelley.transactionBuilderAddOutput(this.ptr, outputPtr);
  }

  /**
  * note: specs return Coin
  * @param {TransactionOutput} output
  * @returns {Promise<BigNum>}
  */
  async fee_for_output(output) {
    const outputPtr = Ptr._assertClass(output, TransactionOutput);
    const ret = await HaskellShelley.transactionBuilderFeeForOutput(this.ptr, outputPtr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @param {BigNum} fee
  * @returns {Promise<void>}
  */
  async set_fee(fee) {
    const feePtr = Ptr._assertClass(fee, BigNum);
    return HaskellShelley.transactionBuilderSetFee(this.ptr, feePtr);
  }

  /**
  * @param {number} ttl
  * @returns {Promise<void>}
  */
  async set_ttl(ttl) {
    return HaskellShelley.transactionBuilderSetTtl(this.ptr, ttl);
  }

  /**
  * @param {number} validityStartInterval
  * @returns {Promise<void>}
  */
  async set_validity_start_interval(validityStartInterval) {
    return HaskellShelley.transactionBuilderSetValidityStartInterval(this.ptr, validityStartInterval);
  }

  /**
  * @param {Certificates} certs
  * @returns {Promise<void>}
  */
  async set_certs(certs) {
    const certsPtr = Ptr._assertClass(certs, Certificates);
    return HaskellShelley.transactionBuilderSetCerts(this.ptr, certsPtr);
  }

  /**
  * @param {Withdrawals} withdrawals
  * @returns {Promise<void>}
  */
  async set_withdrawals(withdrawals) {
    const withdrawalsPtr = Ptr._assertClass(withdrawals, Withdrawals);
    return HaskellShelley.transactionBuilderSetWithdrawals(this.ptr, withdrawalsPtr);
  }

  /**
  * @param {TransactionMetadata} metadata
  * @returns {Promise<void>}
  */
  async set_metadata(metadata) {
    const metadataPtr = Ptr._assertClass(metadata, TransactionMetadata);
    return HaskellShelley.transactionBuilderSetMetadata(this.ptr, metadataPtr);
  }

  /**
  * @param {LinearFee} linearFee
  * @param {BigNum} minimumUtxoVal
  * @param {BigNum} poolDeposit
  * @param {BigNum} keyDeposit
  * @returns {Promise<TransactionBuilder>}
  */
  static async new(linearFee, minimumUtxoVal, poolDeposit, keyDeposit) {
    const linearFeePtr = Ptr._assertClass(linearFee, LinearFee);
    const minimumUtxoValPtr = Ptr._assertClass(minimumUtxoVal, BigNum);
    const poolDepositPtr = Ptr._assertClass(poolDeposit, BigNum);
    const keyDepositPtr = Ptr._assertClass(keyDeposit, BigNum);
    const ret = await HaskellShelley.transactionBuilderNew(
      linearFeePtr,
      minimumUtxoValPtr,
      poolDepositPtr,
      keyDepositPtr,
    );
    return Ptr._wrap(ret, TransactionBuilder);
  }

  /**
  * @returns {Promise<Value>}
  */
  async get_explicit_input() {
    const ret = await HaskellShelley.transactionBuilderGetExplicitInput(this.ptr);
    return Ptr._wrap(ret, Value);
  }

  /**
  * withdrawals and refunds
  * @returns {Promise<Value>}
  */
  async get_implicit_input() {
    const ret = await HaskellShelley.transactionBuilderGetImplicitInput(this.ptr);
    return Ptr._wrap(ret, Value);
  }

  /**
  * note: does not include fee
  * @returns {Promise<Value>}
  */
  async get_explicit_output() {
    const ret = await HaskellShelley.transactionBuilderGetExplicitOutput(this.ptr);
    return Ptr._wrap(ret, Value);
  }

  /**
  * @returns {Promise<BigNum>}
  */
  async get_deposit() {
    const ret = await HaskellShelley.transactionBuilderGetDeposit(this.ptr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @returns {Promise<BigNum | undefined>}
  */
  async get_fee_if_set() {
    const ret = await HaskellShelley.transactionBuilderGetFeeIfSet(this.ptr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @param {Address} address
  * @returns {Promise<boolean>}
  */
  async add_change_if_needed(address) {
    const addressPtr = Ptr._assertClass(address, Address);
    return HaskellShelley.transactionBuilderAddChangeIfNeeded(this.ptr, addressPtr);
  }

  /**
  * @returns {Promise<TransactionBody>}
  */
  async build() {
    const ret = await HaskellShelley.transactionBuilderBuild(this.ptr);
    return Ptr._wrap(ret, TransactionBody);
  }

  /**
  * @returns {Promise<BigNum>}
  */
  async min_fee() {
    const ret = await HaskellShelley.transactionBuilderMinFee(this.ptr);
    return Ptr._wrap(ret, BigNum);
  }
}

export class Withdrawals extends Ptr {
  /**
  * @returns {Promise<Withdrawals>}
  */
  static async new() {
    const ret = await HaskellShelley.withdrawalsNew();
    return Ptr._wrap(ret, Withdrawals);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.withdrawalsLen(this.ptr);
  }

  /**
  * @param {RewardAddress} key
  * @param {BigNum} value
  * @returns {Promise<BigNum>}
  */
  async insert(key, value) {
    const keyPtr = Ptr._assertClass(key, RewardAddress);
    const valuePtr = Ptr._assertClass(value, BigNum);
    const ret = await HaskellShelley.withdrawalsInsert(this.ptr, keyPtr, valuePtr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @param {RewardAddress} key
  * @returns {Promise<BigNum | undefined>}
  */
  async get(key) {
    const keyPtr = Ptr._assertClass(key, RewardAddress);
    const ret = await HaskellShelley.withdrawalsGet(this.ptr, keyPtr);
    return Ptr._wrap(ret, BigNum);
  }

  /**
  * @returns {Promise<RewardAddresses>}
  */
  async keys() {
    const ret = await HaskellShelley.withdrawalsKeys(this.ptr);
    return Ptr._wrap(ret, RewardAddresses);
  }
}

export class MetadataMap extends Ptr {
  /**
  * @returns {Promise<MetadataMap>}
  */
  static async new() {
    const ret = await HaskellShelley.metadataMapNew();
    return Ptr._wrap(ret, MetadataMap);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.metadataMapLen(this.ptr);
  }

  /**
  * @param {TransactionMetadatum} key
  * @param {TransactionMetadatum} value
  * @returns {Promise<TransactionMetadatum>}
  */
  async insert(key, value) {
    const keyPtr = Ptr._assertClass(key, TransactionMetadatum);
    const valuePtr = Ptr._assertClass(value, TransactionMetadatum);
    const ret = await HaskellShelley.metadataMapInsert(this.ptr, keyPtr, valuePtr);
    return Ptr._wrap(ret, TransactionMetadatum);
  }

  /**
  * @param {TransactionMetadatum} key
  * @returns {Promise<TransactionMetadatum | undefined>}
  */
  async get(key) {
    const keyPtr = Ptr._assertClass(key, TransactionMetadatum);
    const ret = await HaskellShelley.metadataMapGet(this.ptr, keyPtr);
    return Ptr._wrap(ret, TransactionMetadatum);
  }

  /**
  * @returns {Promise<MetadataList>}
  */
  async keys() {
    const ret = await HaskellShelley.metadataMapKeys(this.ptr);
    return Ptr._wrap(ret, MetadataList);
  }
}

export class MetadataList extends Ptr {
  /**
  * @returns {Promise<MetadataList>}
  */
  static async new() {
    const ret = await HaskellShelley.metadataListNew();
    return Ptr._wrap(ret, MetadataList);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.metadataListLen(this.ptr);
  }

  /**
  * @param {number} index
  * @returns {Promise<TransactionMetadatum>}
  */
  async get(index) {
    const ret = await HaskellShelley.metadataListGet(this.ptr, index);
    return Ptr._wrap(ret, TransactionMetadatum);
  }

  /**
  * @param {TransactionMetadatum} item
  * @returns {Promise<void>}
  */
  async add(item) {
    const itemPtr = Ptr._assertClass(item, TransactionMetadatum);
    return HaskellShelley.metadataListAdd(this.ptr, itemPtr);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.metadataListToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<MetadataList>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.metadataListFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, MetadataList);
  }
}

export const TransactionMetadatumKind = Object.freeze({
  MetadataMap: 0,
  MetadataList: 1,
  Int:2,
  Bytes: 3,
  Text: 4,
});

export class TransactionMetadatum extends Ptr {
  /**
  * @param {MetadataList} hash
  * @returns {Promise<TransactionMetadatum>}
  */
  static async new_list(metadataList) {
    const metadataListPtr = Ptr._assertClass(metadataList, MetadataList);
    const ret = await HaskellShelley.transactionMetadatumNewList(metadataListPtr);
    return Ptr._wrap(ret, TransactionMetadatum);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.transactionMetadatumToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionMetadatum>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.transactionMetadatumFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, TransactionMetadatum);
  }
}

export const TransactionMetadatumLabel = BigNum;

export class TransactionMetadatumLabels extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.transactionMetadatumLabelsToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionMetadatumLabels>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.transactionMetadatumLabelsFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, TransactionMetadatumLabels);
  }

  /**
  * @returns {Promise<TransactionMetadatumLabels>}
  */
  static async new() {
    const ret = await HaskellShelley.transactionMetadatumLabelsNew();
    return Ptr._wrap(ret, TransactionMetadatumLabels);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.transactionMetadatumLabelsLen(this.ptr);
  }

  /**
  * @param {number} index
  * @returns {Promise<TransactionMetadatumLabel>}
  */
  async get(index) {
    const ret = await HaskellShelley.transactionMetadatumLabelsGet(this.ptr, index);
    return Ptr._wrap(ret, TransactionMetadatumLabel);
  }

  /**
  * @param {TransactionMetadatumLabel} item
  * @returns {Promise<void>}
  */
  add(item) {
    const itemPtr = Ptr._assertClass(item, BigNum);
    return HaskellShelley.transactionMetadatumLabelsAdd(this.ptr, itemPtr);
  }
}

export class GeneralTransactionMetadata extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.generalTransactionMetadataToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<GeneralTransactionMetadata>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.generalTransactionMetadataFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, GeneralTransactionMetadata);
  }

  /**
  * @returns {Promise<GeneralTransactionMetadata>}
  */
  static async new() {
    const ret = await HaskellShelley.generalTransactionMetadataNew();
    return Ptr._wrap(ret, GeneralTransactionMetadata);
  }

  /**
  * @returns {Promise<number>}
  */
  async len() {
    return HaskellShelley.generalTransactionMetadataLen(this.ptr);
  }

  /**
  * @param {TransactionMetadatumLabel} key
  * @param {TransactionMetadatum} value
  * @returns {Promise<TransactionMetadatum | undefined>}
  */
  async insert(key, value) {
    const keyPtr = Ptr._assertClass(key, TransactionMetadatumLabel);
    const valuePtr = Ptr._assertClass(value, TransactionMetadatum);
    const ret = await HaskellShelley.generalTransactionMetadataInsert(this.ptr, keyPtr, valuePtr);
    return Ptr._wrap(ret, TransactionMetadatum);
  }

  /**
  * @param {TransactionMetadatumLabel} key
  * @returns {Promise<TransactionMetadatum | undefined>}
  */
  async get(key) {
    const keyPtr = Ptr._assertClass(key, TransactionMetadatumLabel);
    const ret = await HaskellShelley.generalTransactionMetadataGet(this.ptr, keyPtr);
    return Ptr._wrap(ret, TransactionMetadatum);
  }

  /**
  * @returns {Promise<TransactionMetadatumLabels>}
  */
  async keys() {
    const ret = await HaskellShelley.generalTransactionMetadataKeys(this.ptr);
    return Ptr._wrap(ret, TransactionMetadatumLabels);
  }
}

export class TransactionMetadata extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
    const b64 = await HaskellShelley.transactionMetadataToBytes(this.ptr);
    return Uint8ArrayFromB64(b64);
  }

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionMetadata>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.transactionMetadataFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, TransactionMetadata);
  }

  /**
  * @param {GeneralTransactionMetadata} general
  * @returns {Promise<TransactionMetadata>}
  */
  static async new(general) {
    const generalPtr = Ptr._assertClass(general, GeneralTransactionMetadata);
    const ret = await HaskellShelley.transactionMetadataNew(generalPtr);
    return Ptr._wrap(ret, TransactionMetadata);
  }

  /**
  * @returns {Promise<GeneralTransactionMetadata>}
  */
  async general() {
    const ret = await HaskellShelley.transactionMetadataGeneral(this.ptr);
    return Ptr._wrap(ret, GeneralTransactionMetadata);
  }
}

export const MetadataJsonSchema = Object.freeze({
  NoConversions: 0,
  BasicConversions: 1,
  DetailedSchema: 2,
});
