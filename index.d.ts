export type Optional<T> = T | undefined;

export class Ptr {
  /**
    * Frees the pointer
    * @returns {Promise<void>}
    */
  free(): Promise<void>;
}

export type TransactionIndex = number;

export const make_icarus_bootstrap_witness: (
  txBodyHash: TransactionHash,
  addr: ByronAddress,
  key: Bip32PrivateKey,
) => Promise<BootstrapWitness>;

export const make_vkey_witness: (
  txBodyHash: TransactionHash,
  sk: PrivateKey,
) => Promise<Vkeywitness>;

export const hash_transaction: (
  txBody: TransactionBody,
) => Promise<TransactionHash>;

/**
* @param {Value} assets
* @param {BigNum} minUtxoVal
* @returns {Promise<BigNum>}
*/
export const min_ada_required: (
  assets: Value,
  minUtxoVal: BigNum,
) => Promise<BigNum>;

/**
* @param {string} json
* @returns {Promise<TransactionMetadatum>}
*/
export const encode_json_str_to_metadatum: (
  json: string,
  schema: MetadataJsonSchema,
) => Promise<TransactionMetadatum>;

/**
* @param {TransactionMetadatum} metadatum
* @param {MetadataJsonSchema} schema
* @returns {Promise<string>}
*/
export const decode_metadatum_to_json_str: (
  metadatum: TransactionMetadatum,
  schema: MetadataJsonSchema,
) => Promise<string>;

/**
* Generic u64 wrapper for platforms that don't support u64 or BigInt/etc
* This is an unsigned type - no negative numbers.
* Can be converted to/from plain rust
*/
export class BigNum extends Ptr {
  /**
  * @param {string} string
  * @returns {Promise<Value>}
  */
  static from_str(string: string): Promise<BigNum>;

  /**
  * String representation of the BigNum value for use from environments that
  * don't support BigInt
  * @returns {Promise<string>}
  */
  to_str(): Promise<string>;

  /**
  * @param {BigNum} other
  * @returns {Promise<BigNum>}
  */
  checked_add(other: BigNum): Promise<BigNum>;

  /**
  * @param {BigNum} other
  * @returns {Promise<BigNum>}
  */
  checked_sub(other: BigNum): Promise<BigNum>;

  /**
  * @param {BigNum} other
  * @returns {Promise<BigNum>}
  */
  clamped_sub(other: BigNum): Promise<BigNum>;

  /**
   * @param {BigNum} rhs
   * @returns {Promise<number>}
   */
  compare(rhs: BigNum): Promise<number>;
}

export class Value extends Ptr {

  /**
  * @param {BigNum} coin
  * @returns {Promise<Value>}
  */
  static new(coin: BigNum): Promise<Value>;

  /**
  * TODO: should we return Coin instead?
  * @returns {Promise<BigNum>}
  */
  coin(): Promise<BigNum>;

  /**
  * @param {BigNum} coin
  * @returns {Promise<void>}
  */
  set_coin(coin: BigNum): Promise<void>;

  /**
  * @returns {Promise<MultiAsset | undefined>}
  */
  multiasset(): Promise<MultiAsset | undefined>;

  /**
  * @param {MultiAsset} multiasset
  * @returns {Promise<void>}
  */
  set_multiasset(multiasset: MultiAsset): Promise<void>;

  /**
  * @param {Value} rhs
  * @returns {Promise<Value>}
  */
  checked_add(rhs: Value): Promise<Value>;

  /**
  * @param {Value} rhs
  * @returns {Promise<Value>}
  */
  checked_sub(rhs: Value): Promise<Value>;

  /**
  * @param {Value} rhs
  * @returns {Promise<Value>}
  */
  clamped_sub(rhs: Value): Promise<Value>;

  /**
   * @param {Value} rhs
   * @returns {Promise<number>}
   */
  compare(rhs: Value): Promise<number>;
}

export class Int extends Ptr {
  /**
  * @param {BigNum} x
  * @returns {Promise<Int>}
  */
  static new(x: BigNum): Promise<Int>;

  /**
  * @returns {Promise<number>}
  */
  as_i32(): Promise<number>;
}

export class AssetName extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<AssetName>}
  */
  static from_bytes(bytes: Uint8Array): Promise<AssetName>;

  /**
  * @param {Uint8Array} name
  * @returns {Promise<AssetName>}
  */
  static new(name: Uint8Array): Promise<AssetName>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  name(): Promise<Uint8Array>;
}

export class AssetNames extends Ptr {
  /**
  * @returns {Promise<AssetNames>}
  */
  static new(): Promise<AssetNames>

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {number} index
  * @returns {Promise<AssetName>}
  */
  get(index: number): Promise<AssetName>;

  /**
  * @param {AssetName} item
  * @returns {Promise<void>}
  */
  add(item: AssetName): Promise<void>;
}

/**
* ED25519 key used as public key
*/
export class PublicKey extends Ptr {
  /**
  * Get private key from its bech32 representation
  * Example:
  * ```javascript
  * const pkey = PublicKey.from_bech32(
  *   "ed25519_pk1dgaagyh470y66p899txcl3r0jaeaxu6yd7z2dxyk55qcycdml8gszkxze2"
  * );
  * ```
  * @param {string} bech32_str
  * @returns {Promise<PublicKey>}
  */
  static from_bech32(bech32_str: string): Promise<PublicKey>;

  /**
  * @returns {Promise<string>}
  */
  to_bech32(): Promise<string>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<PublicKey>}
  */
  static from_bytes(bytes: Uint8Array): Promise<PublicKey>

  /**
  * @returns {Promise<Uint8Array>}
  */
  as_bytes(): Promise<Uint8Array>;

  // TODO
  // /**
  // * @param {Uint8Array} data
  // * @param {Ed25519Signature} signature
  // * @returns {Promise<boolean>}
  // */
  // static verify(data, signature): Promise<boolean>

  /**
  * @returns {Promise<Ed25519KeyHash>}
  */
  hash(): Promise<Ed25519KeyHash>;
}

export class PrivateKey extends Ptr {
  /**
  * @returns {Promise<PublicKey>}
  */
  to_public(): Promise<PublicKey>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<PrivateKey>}
  */
  static from_normal_bytes(bytes: Uint8Array): Promise<PublicKey>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  as_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<PrivateKey>}
  */
  static from_extended_bytes(bytes: Uint8Array): Promise<PublicKey>;

  /**
  * @param {Uint8Array} message
  * @returns {Promise<Ed25519Signature>}
  */
  sign(message: Uint8Array): Promise<Ed25519Signature>;
}

/**
*/
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
  derive(index: number): Promise<Bip32PublicKey>;

  /**
  * @returns {Promise<PublicKey>}
  */
  to_raw_key(): Promise<PublicKey>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Bip32PublicKey>}
  */
  static from_bytes(bytes: Uint8Array): Promise<Bip32PublicKey>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  as_bytes(): Promise<Uint8Array>;

  /**
  * @param {string} bech32_str
  * @returns {Promise<Bip32PublicKey>}
  */
  static from_bech32(bech32_str: string): Promise<Bip32PublicKey>;

  /**
  * @returns {Promise<string>}
  */
  to_bech32(): Promise<string>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  chaincode(): Promise<Uint8Array>;
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
  derive(index: number): Promise<Bip32PrivateKey>;

  /**
  * @returns {Promise<Bip32PrivateKey>}
  */
  static generate_ed25519_bip32(): Promise<Bip32PrivateKey>;

  /**
  * @returns {Promise<PrivateKey>}
  */
  to_raw_key(): Promise<PrivateKey>;

  /**
  * @returns {Promise<Bip32PublicKey>}
  */
  to_public(): Promise<Bip32PublicKey>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Bip32PrivateKey>}
  */
  static from_bytes(bytes: Uint8Array): Promise<Bip32PrivateKey>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  as_bytes(): Promise<Uint8Array>;

  /**
  * @param {string} bech32_str
  * @returns {Promise<Bip32PrivateKey>}
  */
  static from_bech32(bech32_str: string): Promise<Bip32PrivateKey>;

  /**
  * @returns {Promise<string>}
  */
  to_bech32(): Promise<string>;

  /**
  * @param {Uint8Array} entropy
  * @param {Uint8Array} password
  * @returns {Promise<Bip32PrivateKey>}
  */
  static from_bip39_entropy(entropy: Uint8Array, password: Uint8Array): Promise<Bip32PrivateKey>;
}

export class ByronAddress extends Ptr {
  /**
  * @returns {Promise<string>}
  */
  to_base58(): Promise<string>;

  /**
  * @param {string} string
  * @returns {Promise<ByronAddress>}
  */
  static from_base58(string: string): Promise<ByronAddress>;

  /**
  * @param {string} string
  * @returns {Promise<boolean>}
  */
  static is_valid(string: string): Promise<boolean>;

  /**
  * @returns {Promise<Address>}
  */
  to_address(): Promise<Address>;

  /**
  * @param {Address} addr
  * @returns {Promise<ByronAddress | undefined>}
  */
  static from_address(addr: Address): Promise<ByronAddress | undefined>;

  /**
  * @returns {Promise<number>}
  */
  byron_protocol_magic(): Promise<number>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  attributes(): Promise<Uint8Array>;
}

export class Address extends Ptr {
  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Address>}
  */
  static from_bytes(bytes: Uint8Array): Promise<Address>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {string | void} prefix
  * @returns {Promise<string>}
  */
  to_bech32(prefix?: string): Promise<string>;

  /**
  * @param {string} string
  * @returns {Promise<Address>}
  */
  static from_bech32(string: string) : Promise<Address>;

  /**
  * @returns {Promise<number>}
  */
  network_id(): Promise<number>;
}

export class Ed25519Signature extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Ed25519Signature>}
  */
  static from_bytes(bytes: Uint8Array): Promise<Ed25519Signature>;

  /**
  * @returns {Promise<string>}
  */
  to_hex(): Promise<string>;
}

export class Ed25519KeyHash extends Ptr {
  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Ed25519KeyHash>}
  */
  static from_bytes(bytes: Uint8Array): Promise<Ed25519KeyHash>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;
}

export class ScriptHash extends Ptr {

  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<ScriptHash>}
  */
  static from_bytes(bytes: Uint8Array): Promise<ScriptHash>;
}

export class ScriptHashes extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<ScriptHashes>}
  */
  static from_bytes(bytes: Uint8Array): Promise<ScriptHashes>;

  /**
  * @returns {Promise<ScriptHashes>}
  */
  static new(): Promise<ScriptHashes>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {number} index
  * @returns {Promise<ScriptHash>}
  */
  get(index: number): Promise<ScriptHash>;

  /**
  * @param {ScriptHash} item
  * @returns {Promise<void>}
  */
  add(item: ScriptHash): Promise<void>;
}

export type PolicyID = ScriptHash;

export type PolicyIDs = ScriptHashes;

export class Assets extends Ptr {
  /**
  * @returns {Promise<Assets>}
  */
  static new(): Promise<Assets>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {AssetName} key
  * @param {BigNum} value
  * @returns {Promise<BigNum>}
  */
  insert(key: AssetName, value: BigNum): Promise<BigNum>;

  /**
  * @param {AssetName} key
  * @returns {Promise<BigNum | undefined>}
  */
  get(key: AssetName): Promise<BigNum | undefined>;

  /**
  * @returns {Promise<AssetNames>}
  */
  keys(): Promise<AssetNames>;
}

export class MultiAsset extends Ptr {
  /**
  * @returns {Promise<MultiAsset>}
  */
  static new(): Promise<MultiAsset>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {PolicyID} key
  * @param {Assets} value
  * @returns {Promise<Assets>}
  */
  insert(key: PolicyID, value: Assets): Promise<Assets>;

  /**
  * @param {PolicyID} key
  * @returns {Promise<Assets | undefined>}
  */
  get(key: PolicyID): Promise<Assets | undefined>;

  /**
  * @returns {Promise<PolicyIDs>}
  */
  keys(): Promise<PolicyIDs>;

  /**
  * @param {MultiAsset} rhs
  * @returns {Promise<MultiAsset>}
  */
  sub(rhs: MultiAsset): Promise<MultiAsset>;
}

export class TransactionHash extends Ptr {
  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionHash>}
  */
  static from_bytes(bytes: Uint8Array): Promise<TransactionHash>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;
}

export class StakeCredential extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<StakeCredential>}
  */
  static from_bytes(bytes: Uint8Array): Promise<StakeCredential>;

  /**
  * @param {Ed25519KeyHash} hash
  * @returns {Promise<StakeCredential>}
  */
  static from_keyhash(hash: Ed25519KeyHash): Promise<StakeCredential>

  /**
  * @param {ScriptHash} hash
  * @returns {Promise<StakeCredential>}
  */
  static from_scripthash(hash: ScriptHash): Promise<StakeCredential>;

  /**
  * @returns {Promise<Ed25519KeyHash>}
  */
  to_keyhash(): Promise<Ed25519KeyHash | undefined>;

  /**
  * @returns {Promise<ScriptHash | undefined>}
  */
  to_scripthash(): Promise<ScriptHash | undefined>;

  /**
  * @returns {Promise<number>}
  */
  kind(): Promise<number>
}

export class StakeRegistration extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<StakeRegistration>}
  */
  static from_bytes(bytes: Uint8Array): Promise<StakeRegistration>;

  /**
  * @returns {Promise<StakeCredential>}
  */
  stake_credential(): Promise<StakeCredential>

  /**
  * @param {StakeCredential} stakeCredential
  * @returns {Promise<StakeRegistration>}
  */
  static new(stakeCredential: StakeCredential): Promise<StakeRegistration>
}

export class StakeDeregistration extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<StakeDeregistration>}
  */
  static from_bytes(bytes: Uint8Array): Promise<StakeDeregistration>;

  /**
  * @returns {Promise<StakeCredential>}
  */
  stake_credential(): Promise<StakeCredential>

  /**
  * @param {StakeCredential} stakeCredential
  * @returns {Promise<StakeDeregistration>}
  */
  static new(stakeCredential: StakeCredential): Promise<StakeDeregistration>;
}

export class StakeDelegation extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<StakeDelegation>}
  */
  static from_bytes(bytes: Uint8Array): Promise<StakeDelegation>;

  /**
  * @returns {Promise<StakeCredential>}
  */
  stake_credential(): Promise<StakeCredential>;

  /**
  * @returns {Promise<Ed25519KeyHash>}
  */
  pool_keyhash(): Promise<Ed25519KeyHash>;

  /**
  * @param {StakeCredential} stakeCredential
  * @param {Ed25519KeyHash} poolKeyHash
  * @returns {Promise<StakeDelegation>}
  */
  static new(
    stakeCredential: StakeCredential,
    poolKeyHash: Ed25519KeyHash,
  ): Promise<StakeDelegation>;
}

export class Certificate extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Certificate>}
  */
  static from_bytes(bytes: Uint8Array): Promise<Certificate>;

  /**
  * @param {StakeRegistration} stakeRegistration
  * @returns {Promise<Certificate>}
  */
  static new_stake_registration(stakeRegistration: StakeRegistration): Promise<Certificate>;

  /**
  * @param {StakeDeregistration} stakeDeregistration
  * @returns {Promise<Certificate>}
  */
  static new_stake_deregistration(stakeDeregistration: StakeDeregistration): Promise<Certificate>;

  /**
  * @param {StakeDelegation} stakeDelegation
  * @returns {Promise<Certificate>}
  */
  static new_stake_delegation(stakeDelegation: StakeDelegation): Promise<Certificate>;

  /**
  * @returns {Promise<StakeRegistration | undefined>}
  */
  as_stake_registration(): Promise<StakeRegistration | undefined>;

  /**
  * @returns {Promise<StakeDeregistration | undefined>}
  */
  as_stake_deregistration(): Promise<StakeDeregistration | undefined>;

  /**
  * @returns {Promise<StakeDelegation | undefined>}
  */
  as_stake_delegation(): Promise<StakeDelegation | undefined>;
}

export class Certificates extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Certificates>}
  */
  static from_bytes(bytes: Uint8Array): Promise<Certificates>;

  /**
  * @returns {Promise<Certificates>}
  */
  static new(): Promise<Certificates>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {number} index
  * @returns {Promise<Certificate>}
  */
  get(index: number): Promise<Certificate>;

  /**
  * @param {Certificate} item
  * @returns {Promise<void>}
  */
  add(item: Certificate): Promise<void>;
}


export class BaseAddress extends Ptr {

  /**
  * @param {number} network
  * @param {StakeCredential} payment
  * @param {StakeCredential} stake
  * @returns {Promise<BaseAddress>}
  */
  static new(
    network: number,
    payment: StakeCredential,
    stake: StakeCredential,
  ): Promise<BaseAddress>;

  /**
  * @returns {Promise<StakeCredential>}
  */
  payment_cred(): Promise<StakeCredential>;

  /**
  * @returns {Promise<StakeCredential>}
  */
  stake_cred(): Promise<StakeCredential>;

  /**
  * @returns {Promise<Address>}
  */
  to_address(): Promise<Address>;

  /**
  * @param {Address} addr
  * @returns {Promise<BaseAddress | undefined>}
  */
  static from_address(addr: Address): Promise<BaseAddress | undefined>;
}

export class RewardAddress extends Ptr {
  /**
  * @param {number} network
  * @param {StakeCredential} payment
  * @returns {Promise<RewardAddress>}
  */
  static new(network: number, payment: StakeCredential): Promise<RewardAddress>;

  /**
  * @returns {Promise<StakeCredential>}
  */
  payment_cred(): Promise<StakeCredential>;

  /**
  * @returns {Promise<Address>}
  */
  to_address(): Promise<Address>;

  /**
  * @param {Address} addr
  * @returns {Promise<RewardAddress | undefined>}
  */
  static from_address(addr: Address): Promise<RewardAddress | undefined>;
}

export class RewardAddresses extends Ptr {
  /**
  * @returns {Promise<RewardAddresses>}
  */
  static new(): Promise<RewardAddresses>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {number} index
  * @returns {Promise<RewardAddress>}
  */
  get(index: number): Promise<RewardAddress>;

  /**
  * @param {RewardAddress} item
  * @returns {Promise<void>}
  */
  add(item: RewardAddress): Promise<void>;
}

export class UnitInterval extends Ptr {
  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<UnitInterval>}
  */
  static from_bytes(bytes: Uint8Array): Promise<UnitInterval>;

  /**
  * @param {BigNum} numerator
  * @param {BigNum} denominator
  * @returns {Promise<UnitInterval>}
  */
  static new(
    numerator: BigNum,
    denominator: BigNum,
  ): Promise<UnitInterval>;
}

export class TransactionInput extends Ptr {
  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionInput>}
  */
  static from_bytes(bytes: Uint8Array): Promise<TransactionInput>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @returns {Promise<TransactionHash>}
  */
  transaction_id(): Promise<TransactionHash>;

  /**
  * @returns {Promise<number>}
  */
  index(): Promise<number>;

  /**
  * @param {TransactionHash} transactionId
  * @param {TransactionIndex} index
  * @returns {Promise<TransactionInput>}
  */
  static new(transactionId: TransactionHash, index: TransactionIndex): Promise<TransactionInput>;
}

export class TransactionInputs extends Ptr {
  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;
  /**
  * @param {number} index
  * @returns {Promise<TransactionInput>}
  */
  get(index: number): Promise<TransactionInput>;
}

export class TransactionOutput extends Ptr {
  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionOutput>}
  */
  static from_bytes(bytes: Uint8Array): Promise<TransactionOutput>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Address} address
  * @param {BigNum} amount
  * @returns {Promise<TransactionOutput>}
  */
  static new(address: Address, amount: Value): Promise<TransactionOutput>;

  /**
  * @returns {Promise<Address>}
  */
  address(): Promise<Address>;

  /**
  * @returns {Promise<Value>}
  */
  amount(): Promise<Value>;
}

export class TransactionOutputs extends Ptr {
  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;
  /**
  * @param {number} index
  * @returns {Promise<TransactionOutput>}
  */
  get(index: number): Promise<TransactionOutput>;
}

export class LinearFee extends Ptr {
  /**
  * @returns {Promise<BigNum>}
  */
  constant(): Promise<BigNum>;

  /**
  * @returns {Promise<BigNum>}
  */
  coefficient(): Promise<BigNum>;

  /**
  * @param {BigNum} coefficient
  * @param {BigNum} constant
  * @returns {Promise<LinearFee>}
  */
  static new(coefficient: BigNum, constant: BigNum): Promise<LinearFee>;
}

export class Vkey extends Ptr {
  /**
  * @param {PublicKey} pk
  * @returns {Promise<Vkey>}
  */
  static new(pk: PublicKey): Promise<Vkey>;
}

export class Vkeywitness extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<Vkeywitness>}
  */
  static from_bytes(bytes: Uint8Array): Promise<Vkeywitness>;

  /**
  * @param {Vkey} vkey
  * @param {Ed25519Signature} signature
  * @returns {Promise<Vkeywitness>}
  */
  static new(vkey: Vkey, signature: Ed25519Signature): Promise<Vkeywitness>;

  /**
  * @returns {Promise<Ed25519Signature>}
  */
  signature(): Promise<Ed25519Signature>;
}

export class Vkeywitnesses extends Ptr {
  /**
  * @returns {Promise<Vkeywitnesses>}
  */
  static new(): Promise<Vkeywitnesses>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {Vkeywitness} item
  * @returns {Promise<void>}
  */
  add(item: Vkeywitness): Promise<void>;
}

export class BootstrapWitness extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<BootstrapWitness>}
  */
  static from_bytes(bytes: Uint8Array): Promise<BootstrapWitness>;

  /**
  * @param {Vkey} vkey
  * @param {Ed25519Signature} signature
  * @param {Uint8Array} chainCode
  * @param {Uint8Array} attributes
  * @returns {Promise<BootstrapWitness>}
  */
  static new(
    vkey: Vkey,
    signature: Ed25519Signature,
    chainCode: Uint8Array,
    attributes: Uint8Array,
  ): Promise<BootstrapWitness>
}

export class BootstrapWitnesses extends Ptr {
  /**
  * @returns {Promise<BootstrapWitnesses>}
  */
  static new(): Promise<BootstrapWitnesses>

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>

  /**
  * @param {BootstrapWitness} item
  * @returns {Promise<void>}
  */
  add(item: BootstrapWitness): Promise<void>
}

export class TransactionWitnessSet extends Ptr {
  /**
  * @returns {Promise<TransactionWitnessSet>}
  */
  static new(): Promise<TransactionWitnessSet>

  /**
  * @param {BootstrapWitnesses} bootstraps
  * @returns {Promise<void>}
  */
  set_bootstraps(bootstraps: BootstrapWitnesses): Promise<void>

  /**
  * @param {Vkeywitnesses} bootstraps
  * @returns {Promise<void>}
  */
  set_vkeys(vkeywitnesses: Vkeywitnesses): Promise<void>
}

export class ScriptPubkey extends Ptr {
  /**
  * @returns {Promise<Ed25519KeyHash>}
  */
  addr_keyhash(): Promise<Ed25519KeyHash>;

  /**
  * @param {Ed25519KeyHash} addrKeyhash
  * @returns {Promise<ScriptPubkey>}
  */
  static new(addrKeyhash: Ed25519KeyHash): Promise<ScriptPubkey>;
}

export class TransactionBody extends Ptr {
  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionBody>}
  */
  static from_bytes(bytes: Uint8Array): Promise<TransactionBody>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @returns {Promise<TransactionInputs>}
  */
  inputs(): Promise<TransactionInputs>;

  /**
  * @returns {Promise<TransactionOutputs>}
  */
  outputs(): Promise<TransactionOutputs>;

  /**
  * @returns {Promise<BigNum>}
  */
  fee(): Promise<BigNum>;

  /**
  * @returns {Promise<Optional<number>>}
  */
  ttl(): Promise<Optional<number>>;

  /**
  * @returns {Promise<Certificates>}
  */
  certs(): Promise<Certificates>;

  /**
  * @returns {Promise<Withdrawals>}
  */
  withdrawals(): Promise<Withdrawals>;
}

export class Transaction extends Ptr {
  /**
  * @returns {Promise<TransactionBody>}
  */
  body(): Promise<TransactionBody>;

  /**
  * @param {TransactionBody} body
  * @param {TransactionWitnessSet} witnessSet
  * @param {TransactionMetadata | void} metadata
  * @returns {Promise<Transaction>}
  */
  static new(
    body: TransactionBody,
    witnessSet: TransactionWitnessSet,
    metadata?: TransactionMetadata,
  ): Promise<Transaction>;
}

export class TransactionBuilder extends Ptr {
  /**
  * @param {Ed25519KeyHash} hash
  * @param {TransactionInput} input
  * @param {Value} amount
  * @returns {Promise<void>}
  */
  add_key_input(
    hash: Ed25519KeyHash,
    input: TransactionInput,
    amount: Value,
  ): Promise<void>;

  /**
  * @param {ByronAddress} hash
  * @param {TransactionInput} input
  * @param {Value} amount
  * @returns {Promise<void>}
  */
  add_bootstrap_input(
    hash: ByronAddress,
    input: TransactionInput,
    amount: Value,
  ): Promise<void>;

  /**
  * @param {Address} address
  * @param {TransactionInput} input
  * @param {Value} amount
  * @returns {Promise<void>}
  */
  add_input(
    address: Address,
    input: TransactionInput,
    amount: Value,
  ): Promise<void>;

  /**
  * note: specs return Coin
  * @param {Address} address
  * @param {TransactionInput} input
  * @param {Value} amount
  * @returns {Promise<BigNum>}
  */
  fee_for_input(
    address: Address,
    input: TransactionInput,
    amount: Value,
  ): Promise<BigNum>;

  /**
  * @param {TransactionOutput} output
  * @returns {Promise<void>}
  */
  add_output(output: TransactionOutput): Promise<void>;

  /**
  * @param {TransactionOutput} output
  * @returns {Promise<BigNum>}
  */
  fee_for_output(output: TransactionOutput): Promise<BigNum>;

  /**
  * @param {BigNum} fee
  * @returns {Promise<void>}
  */
  set_fee(fee: BigNum): Promise<void>;

  /**
  * @param {number} ttl
  * @returns {Promise<void>}
  */
  set_ttl(ttl: number): Promise<void>;

  /**
  * @param {number} validityStartInterval
  * @returns {Promise<void>}
  */
  set_validity_start_interval(
    validityStartInterval: number,
  ): Promise<void>;

  /**
  * @param {Certificates} certs
  * @returns {Promise<void>}
  */
  set_certs(certs: Certificates): Promise<void>;

  /**
  * @param {Withdrawals} certs
  * @returns {Promise<void>}
  */
  set_withdrawals(withdrawals: Withdrawals): Promise<void>;

  /**
  * @param {TransactionMetadata} metadata
  * @returns {Promise<void>}
  */
  set_metadata(metadata: TransactionMetadata): Promise<void>;

  /**
  * @param {LinearFee} linearFee
  * @param {BigNum} minimumUtxoVal
  * @param {BigNum} poolDeposit
  * @param {BigNum} keyDeposit
  * @returns {Promise<TransactionBuilder>}
  */
  static new(
    linearFee: LinearFee,
    minimumUtxoVal: BigNum,
    poolDeposit: BigNum,
    keyDeposit: BigNum,
  ): Promise<TransactionBuilder>;

  /**
  * @returns {Promise<Value>}
  */
  get_explicit_input(): Promise<Value>;

  /**
  * @returns {Promise<Value>}
  */
  get_implicit_input(): Promise<Value>;

  /**
  * @returns {Promise<Value>}
  */
  get_explicit_output(): Promise<Value>;

  /**
  * @returns {Promise<BigNum>}
  */
  get_deposit(): Promise<BigNum>;

  /**
  * @returns {Promise<BigNum>}
  */
  get_fee_if_set(): Promise<BigNum>;

  /**
  * @param {Address} address
  * @returns {Promise<boolean>}
  */
  add_change_if_needed(address: Address): Promise<boolean>;

  /**
  * @returns {Promise<TransactionBody>}
  */
  build(): Promise<TransactionBody>;

  /**
  * @returns {Promise<BigNum>}
  */
  min_fee(): Promise<BigNum>;
}

export class Withdrawals extends Ptr {
  /**
  * @returns {Promise<Withdrawals>}
  */
  static new(): Promise<Withdrawals>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {RewardAddress} key
  * @param {BigNum} value
  * @returns {Promise<BigNum>}
  */
  insert(key: RewardAddress, value: BigNum): Promise<BigNum>;

  /**
  * @param {RewardAddress} key
  * @returns {Promise<BigNum | undefined>}
  */
  get(key: RewardAddress): Promise<BigNum | undefined>;

  /**
  * @returns {Promise<RewardAddresses>}
  */
  keys(): Promise<RewardAddresses>;
}

export class MetadataMap extends Ptr {
  /**
  * @returns {Promise<MetadataMap>}
  */
  static new(): Promise<MetadataMap>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {TransactionMetadatum} key
  * @param {TransactionMetadatum} value
  * @returns {Promise<TransactionMetadatum>}
  */
  insert(
    key: TransactionMetadatum,
    value: TransactionMetadatum,
  ): Promise<TransactionMetadatum>;

  /**
  * @param {TransactionMetadatum} key
  * @returns {Promise<TransactionMetadatum | undefined>}
  */
  get(key: TransactionMetadatum): Promise<TransactionMetadatum | undefined>;

  /**
  * @returns {Promise<MetadataList>}
  */
  keys(): Promise<MetadataList>;
}


export class MetadataList extends Ptr {
  /**
  * @returns {Promise<MetadataList>}
  */
  static new(): Promise<MetadataList>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {number} index
  * @returns {Promise<TransactionMetadatum>}
  */
  get(index: number): Promise<TransactionMetadatum>;

  /**
  * @param {TransactionMetadatum} item
  * @returns {Promise<void>}
  */
  add(item: TransactionMetadatum): Promise<void>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<MetadataList>}
  */
  static from_bytes(bytes: Uint8Array): Promise<MetadataList>;
}

export enum TransactionMetadatumKind {
  MetadataMap,
  MetadataList,
  Int,
  Bytes,
  Text,
}

export class TransactionMetadatum extends Ptr {
  /**
  * @param {MetadataList} hash
  * @returns {Promise<TransactionMetadatum>}
  */
  static new_list(metadataList: MetadataList): Promise<TransactionMetadatum>;

  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionMetadatum>}
  */
  static from_bytes(bytes: Uint8Array): Promise<TransactionMetadatum>;
}

export type TransactionMetadatumLabel = BigNum;

export class TransactionMetadatumLabels extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionMetadatumLabels>}
  */
  static from_bytes(bytes: Uint8Array): Promise<TransactionMetadatumLabels>;

  /**
  * @returns {Promise<TransactionMetadatumLabels>}
  */
  static new(): Promise<TransactionMetadatumLabels>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {number} index
  * @returns {Promise<TransactionMetadatumLabel>}
  */
  get(index: number): Promise<TransactionMetadatumLabel>;

  /**
  * @param {TransactionMetadatumLabel} item
  * @returns {Promise<void>}
  */
  add(item: TransactionMetadatumLabel): Promise<void>;
}

export class GeneralTransactionMetadata extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<GeneralTransactionMetadata>}
  */
  static from_bytes(bytes: Uint8Array): Promise<GeneralTransactionMetadata>;

  /**
  * @returns {Promise<GeneralTransactionMetadata>}
  */
  static new(): Promise<GeneralTransactionMetadata>;

  /**
  * @returns {Promise<number>}
  */
  len(): Promise<number>;

  /**
  * @param {TransactionMetadatumLabel} key
  * @param {TransactionMetadatum} value
  * @returns {Promise<TransactionMetadatum | undefined>}
  */
  insert(
    key: TransactionMetadatumLabel,
    value: TransactionMetadatum,
  ): Promise<TransactionMetadatum | undefined>;

  /**
  * @param {TransactionMetadatumLabel} key
  * @returns {Promise<TransactionMetadatum | undefined>}
  */
  get(key: TransactionMetadatumLabel): Promise<TransactionMetadatum | undefined>;

  /**
  * @returns {Promise<TransactionMetadatumLabels>}
  */
  keys(): Promise<TransactionMetadatumLabels>;
}

export class TransactionMetadata extends Ptr {
  /**
  * @returns {Promise<Uint8Array>}
  */
  to_bytes(): Promise<Uint8Array>;

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<TransactionMetadata>}
  */
  static from_bytes(bytes): Promise<TransactionMetadata>;
  /**
  * @param {GeneralTransactionMetadata} general
  * @returns {Promise<TransactionMetadata>}
  */
  static new(general: GeneralTransactionMetadata): Promise<TransactionMetadata>;

  /**
  * @returns {Promise<GeneralTransactionMetadata>}
  */
  general(): Promise<GeneralTransactionMetadata>;
}

export enum MetadataJsonSchema {
  NoConversions,
  BasicConversions,
  DetailedSchema,
}
