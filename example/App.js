/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

/* eslint-disable  max-len */

import React, {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {
  Address,
  BaseAddress,
  BigNum,
  Bip32PublicKey,
  Bip32PrivateKey,
  BootstrapWitness,
  BootstrapWitnesses,
  ByronAddress,
  Certificate,
  Certificates,
  Ed25519Signature,
  Ed25519KeyHash,
  LinearFee,
  hash_transaction,
  make_vkey_witness,
  make_icarus_bootstrap_witness,
  PublicKey,
  RewardAddress,
  RewardAddresses,
  StakeCredential,
  StakeDelegation,
  StakeDeregistration,
  StakeRegistration,
  Transaction,
  TransactionBuilder,
  TransactionBody,
  TransactionHash,
  TransactionInput,
  TransactionOutput,
  TransactionWitnessSet,
  UnitInterval,
  Vkey,
  Vkeywitness,
  Vkeywitnesses,
  Withdrawals,
} from 'react-native-haskell-shelley'

const assert = (value: any, message: string, ...args: any) => {
  if (value) {
    return
  }
  console.error(`Assertion failed: ${message}`, ...args)
  throw new Error(message)
}

export default class App extends Component<{}> {
  state = {
    status: 'starting',
  }
  async componentDidMount() {
    const addrHex = '0000b03c3aa052f51c086c54bd4059ead2d2e426ac89fa4b3ce41cbf' // 28B
    const addrBytes = Buffer.from(addrHex, 'hex')

    try {
      // ------------------------------------------------
      // -------------------- BigNum --------------------
      const bigNumStr = '1000000'
      const bigNum = await BigNum.from_str(bigNumStr)
      assert(
        (await bigNum.to_str()) === bigNumStr,
        'BigNum.to_str() should match original input value',
      )
      const bigNum2 = await BigNum.from_str('500')
      assert(
        (await (await bigNum.checked_add(bigNum2)).to_str()) === '1000500',
        'BigNum.checked_add()',
      )
      assert(
        (await (await bigNum.checked_sub(bigNum2)).to_str()) === '999500',
        'BigNum.checked_sub()',
      )

      // ------------------------------------------------
      // ------------------ PrivateKey ------------------
      const bip32PrvKeyHex =
        '20afd5ff1f7f551c481b7e3f3541f7c63f5f6bcb293af92565af3deea0bcd648' +
        '1a6e7b8acbe38f3906c63ccbe8b2d9b876572651ac5d2afc0aca284d9412bb1b' +
        '4839bf02e1d990056d0f06af22ce4bcca52ac00f1074324aab96bbaaaccf290d'
      const _bip32PrivateKey = await Bip32PrivateKey.from_bytes(
        Buffer.from(bip32PrvKeyHex, 'hex'),
      )
      const privateKey = await _bip32PrivateKey.to_raw_key()
      assert(
        (await (await privateKey.to_public()).as_bytes()).length === 32,
        'PrivateKey::to_public()',
      )

      // ------------------------------------------------
      // ------------------ PublicKey -------------------
      const pkeyBech32 =
        'ed25519_pk1dgaagyh470y66p899txcl3r0jaeaxu6yd7z2dxyk55qcycdml8gszkxze2'
      const publicKey = await PublicKey.from_bech32(pkeyBech32)
      assert(
        (await publicKey.to_bech32()) === pkeyBech32,
        'PublicKey.to_bech32() should match original input value',
      )
      assert(
        (await publicKey.as_bytes()).length === 32,
        'PublicKey.as_bytes() should be 32 bytes length',
      )
      assert(
        (await (await publicKey.hash()).to_bytes()).length,
        'PublicKey.hash()',
      )

      // ------------------------------------------------
      // --------------- Bip32PrivateKey ----------------
      const bip32PrivKeyBytes =
        '70afd5ff1f7f551c481b7e3f3541f7c63f5f6bcb293af92565af3deea0bcd648' +
        '1a6e7b8acbe38f3906c63ccbe8b2d9b876572651ac5d2afc0aca284d9412bb1b' +
        '4839bf02e1d990056d0f06af22ce4bcca52ac00f1074324aab96bbaaaccf290d'
      const bip32PrivateKey = await Bip32PrivateKey.from_bytes(
        Buffer.from(bip32PrivKeyBytes, 'hex'),
      )
      assert(
        Buffer.from(await bip32PrivateKey.as_bytes()).toString('hex') ===
          bip32PrivKeyBytes,
        'bip32PrivateKey.as_bytes() should match original input value',
      )

      // ------------------------------------------------
      // --------------- Bip32PublicKey ----------------
      const bip32PubKeyBytes =
        '64593d25cfbb70ddff435e75194cc4854e5d0f67a26e4493c5c00e0a989bd144' +
        '4839bf02e1d990056d0f06af22ce4bcca52ac00f1074324aab96bbaaaccf290d'
      const bip32PublicKey = await Bip32PublicKey.from_bytes(
        Buffer.from(bip32PubKeyBytes, 'hex'),
      )
      assert(
        Buffer.from(await bip32PublicKey.as_bytes()).toString('hex') ===
          bip32PubKeyBytes,
        'bip32PublicKey.as_bytes() should match original input value',
      )

      // ------------------------------------------------
      // ------------------ Address ---------------------
      const baseAddrHex =
        '00' +
        '0000b03c3aa052f51c086c54bd4059ead2d2e426ac89fa4b3ce41cbf' +
        '0000b03c3aa052f51c086c54bd4059ead2d2e426ac89fa4b3ce41cbf'
      const baseAddrBytes = Buffer.from(baseAddrHex, 'hex')
      const address = await Address.from_bytes(baseAddrBytes)
      const addrPtrToBytes = await address.to_bytes()
      assert(
        Buffer.from(addrPtrToBytes).toString('hex') === baseAddrHex,
        'Address.to_bytes should match original input address',
      )
      let addrFromBech32 = await Address.from_bech32(
        'addr1u8pcjgmx7962w6hey5hhsd502araxp26kdtgagakhaqtq8sxy9w7g',
      )
      assert(
        (await addrFromBech32.to_bech32('foobar')) ===
          'foobar1u8pcjgmx7962w6hey5hhsd502araxp26kdtgagakhaqtq8s92n4tm',
        'Address.to_bech32 with prefix',
      )
      assert(
        (await addrFromBech32.to_bech32()) ===
          'stake1u8pcjgmx7962w6hey5hhsd502araxp26kdtgagakhaqtq8squng76',
        'Address.to_bech32 with default prefix',
      )
      addrFromBech32 = await Address.from_bech32(
        'addr1qyfh4879pratq227f5z6qr48mvwa3acwvtyvgq5553jk8g7nsw44z0v5d2emp8unhqz5em0d7cup75vrxhlqf6l9nzfqphk420',
      )
      assert(
        (await addrFromBech32.to_bech32()) ===
          'addr1qyfh4879pratq227f5z6qr48mvwa3acwvtyvgq5553jk8g7nsw44z0v5d2emp8unhqz5em0d7cup75vrxhlqf6l9nzfqphk420',
        'Address.to_bech32 with default prefix',
      )

      // ------------------------------------------------
      // ----------------- ByronAddress -----------------
      const addrBase58 =
        'Ae2tdPwUPEZHu3NZa6kCwet2msq4xrBXKHBDvogFKwMsF18Jca8JHLRBas7'
      const byronAddress = await ByronAddress.from_base58(addrBase58)
      assert(
        (await byronAddress.to_base58()) === addrBase58,
        'ByronAddress.to_base58 should match original input address',
      )
      const byronAddrFromAddr = await ByronAddress.from_address(address)
      const addrFromByronAddr = await byronAddress.to_address()
      assert(
        byronAddrFromAddr === undefined,
        'ByronAddress.from_address should return undefined on non-byron Address',
      )
      assert(
        !(await ByronAddress.is_valid(baseAddrHex)),
        'ByronAddress.is_valid should return false on non-byron Address',
      )
      assert(
        await ByronAddress.is_valid(addrBase58),
        'ByronAddress.is_valid should return true on valid address',
      )
      assert(
        (await (
          await ByronAddress.from_address(addrFromByronAddr)
        ).to_base58()) === addrBase58,
        'ByronAddress.to_address',
      )

      // ------------------------------------------------
      // ---------------- Ed25519Signature ----------------
      const signatureHex =
        '00b36cebd884e6661f27d8888d7e1baa5de6ced4eb66dd14b4103abb755c83f0196d5cbd7851ec1b60e94f6a8e4b9ef2deab3f680af7319e4fc86aba1c412f02'
      const ed25519Signature = await Ed25519Signature.from_bytes(
        Buffer.from(signatureHex, 'hex'),
      )
      const ed25519SignatureToBytes = await ed25519Signature.to_bytes()
      assert(
        Buffer.from(ed25519SignatureToBytes).toString('hex') === signatureHex,
        'Ed25519Signature from_bytes/to_bytes',
      )

      // ------------------------------------------------
      // ---------------- Ed25519KeyHash ----------------
      const ed25519KeyHash = await Ed25519KeyHash.from_bytes(addrBytes)
      const addrToBytes = await ed25519KeyHash.to_bytes()
      assert(
        Buffer.from(addrToBytes).toString('hex') === addrHex,
        'Ed25519KeyHash.to_bytes should match original input address',
      )

      // ------------------------------------------------
      // -------------- Vkey & Vkeywitness --------------
      const _vkey = await Vkey.new(publicKey)
      assert(_vkey instanceof Vkey, 'Vkey::new()')
      const _vkeywitness = await Vkeywitness.new(_vkey, ed25519Signature)
      assert(_vkeywitness instanceof Vkeywitness, 'Vkeywitness::new()')

      // ------------------------------------------------
      // --------------- TransactionHash ----------------
      const hash32Hex =
        '0000b03c3aa052f51c086c54bd4059ead2d2e426ac89fa4b3ce41cbf3ce41cbf'
      const hash32Bytes = Buffer.from(hash32Hex, 'hex')
      const txHash = await TransactionHash.from_bytes(hash32Bytes)
      const txHashToBytes = await txHash.to_bytes()
      assert(
        Buffer.from(txHashToBytes).toString('hex') === hash32Hex,
        'TransactionHash.to_bytes should match original input address',
      )

      // ------------------------------------------------
      // --------------- StakeCredential ----------------
      const stakeCred = await StakeCredential.from_keyhash(ed25519KeyHash)
      const ed25519KeyHashOrig = await stakeCred.to_keyhash()
      const stakeCredBytes = await stakeCred.to_bytes()
      const stakeCredFromBytes = await StakeCredential.from_bytes(
        Buffer.from(stakeCredBytes, 'hex'),
      )
      assert(
        Buffer.from(await ed25519KeyHashOrig.to_bytes()).toString('hex') ===
          addrHex,
        'StakeCredential:: -> to_keyhash -> to_bytes should match original input',
      )
      assert(
        (await stakeCred.kind()) === 0,
        'StakeCredential:: kind should match',
      )
      assert(
        Buffer.from(
          await (await stakeCredFromBytes.to_keyhash()).to_bytes(),
        ).toString('hex') === addrHex,
        'StakeCredential -> to_bytes -> from_bytes -> to_keyhash -> should match',
      )

      // ------------------------------------------------
      // --------------- StakeRegistration --------------
      const stakeReg = await StakeRegistration.new(stakeCred)
      assert(
        Buffer.from(
          await (await stakeReg.stake_credential()).to_bytes(),
        ).toString('hex') ===
          Buffer.from(await stakeCred.to_bytes()).toString('hex'),
        'StakeRegistration:: new() -> stake_credential()',
      )
      const stakeRegHex = Buffer.from(
        await stakeReg.to_bytes(),
        'hex',
      ).toString('hex')
      const _stakeReg = await StakeRegistration.from_bytes(
        Buffer.from(stakeRegHex, 'hex'),
      )
      assert(
        Buffer.from(await _stakeReg.to_bytes(), 'hex').toString('hex') ===
          stakeRegHex,
        'StakeRegistration::to/from_bytes()',
      )

      // ------------------------------------------------
      // -------------- StakeDeregistration -------------
      const stakeDereg = await StakeDeregistration.new(stakeCred)
      assert(
        Buffer.from(
          await (await stakeDereg.stake_credential()).to_bytes(),
        ).toString('hex') ===
          Buffer.from(await stakeCred.to_bytes()).toString('hex'),
        'StakeDeregistration:: new() -> stake_credential()',
      )
      const stakeDeregHex = Buffer.from(
        await stakeDereg.to_bytes(),
        'hex',
      ).toString('hex')
      const _stakeDereg = await StakeDeregistration.from_bytes(
        Buffer.from(stakeDeregHex, 'hex'),
      )
      assert(
        Buffer.from(await _stakeDereg.to_bytes(), 'hex').toString('hex') ===
          stakeDeregHex,
        'StakeDeregistration::to/from_bytes()',
      )

      // ------------------------------------------------
      // ---------------- StakeDelegation ---------------
      const poolKeyHash = await Ed25519KeyHash.from_bytes(
        Buffer.from(
          '0000b03c3aa052f51c086c54bd4059ead2d2e426ac89fa4b3ce43dcd',
          'hex',
        ),
      )
      const stakeDelegation = await StakeDelegation.new(stakeCred, poolKeyHash)
      assert(
        Buffer.from(
          await (await stakeDelegation.stake_credential()).to_bytes(),
        ).toString('hex') ===
          Buffer.from(await stakeCred.to_bytes()).toString('hex'),
        'StakeDelegation:: new() -> stake_credential()',
      )
      assert(
        Buffer.from(
          await (await stakeDelegation.pool_keyhash()).to_bytes(),
        ).toString('hex') ===
          Buffer.from(await poolKeyHash.to_bytes()).toString('hex'),
        'StakeDelegation:: new() -> pool_keyhash()',
      )
      const stakeDelHex = Buffer.from(
        await stakeDelegation.to_bytes(),
        'hex',
      ).toString('hex')
      const _stakeDel = await StakeDelegation.from_bytes(
        Buffer.from(stakeDelHex, 'hex'),
      )
      assert(
        Buffer.from(await _stakeDel.to_bytes(), 'hex').toString('hex') ===
          stakeDelHex,
        'StakeDeregistration::to/from_bytes()',
      )

      // ------------------------------------------------
      // ------------------ Certificate -----------------
      const cert = await Certificate.new_stake_registration(stakeReg)
      const certHex = Buffer.from(await cert.to_bytes(), 'hex').toString('hex')
      const _cert = await Certificate.from_bytes(Buffer.from(certHex, 'hex'))
      assert(
        Buffer.from(await _cert.to_bytes(), 'hex').toString('hex') === certHex,
        'Certificate::new_stake_registration()',
      )
      const certDereg = await Certificate.new_stake_deregistration(stakeDereg)
      assert(certDereg, 'Certificate::new_stake_deregistration()')
      const certDel = await Certificate.new_stake_delegation(stakeDelegation)
      assert(certDel, 'Certificate::new_stake_delegation()')

      // ------------------------------------------------
      // ----------------- Certificates -----------------
      const certs = await Certificates.new()
      assert((await certs.len()) === 0, 'Certificates.len() should return 0')
      await certs.add(cert)
      assert((await certs.len()) === 1, 'Certificates.len() should return 1')

      // ------------------------------------------------
      // ----------------- BaseAddress ------------------
      const pymntAddr =
        '0000b03c3aa052f51c086c54bd4059ead2d2e426ac89fa4b3ce41c0a' // 28B
      const pymntAddrKeyHash = await Ed25519KeyHash.from_bytes(
        Buffer.from(pymntAddr, 'hex'),
      )
      const paymentCred = await StakeCredential.from_keyhash(pymntAddrKeyHash)
      const baseAddr = await BaseAddress.new(0, paymentCred, stakeCred)

      const pymntCredFromBaseAddr = await baseAddr.payment_cred()
      const pymntAddrFromPymntCred = await pymntCredFromBaseAddr.to_keyhash()
      assert(
        Buffer.from(await pymntAddrFromPymntCred.to_bytes()).toString('hex') ===
          pymntAddr,
        'BaseAddress:: -> payment_cred -> keyhash should match original input',
      )
      const baseAddrFromAddr = await BaseAddress.from_address(address)
      assert(!!baseAddrFromAddr, 'baseAddress.from_address')
      const baseAddrToAddr = await baseAddrFromAddr.to_address()
      assert(
        Buffer.from(await baseAddrToAddr.to_bytes(), 'hex').toString('hex') ===
          Buffer.from(await address.to_bytes(), 'hex').toString('hex'),
        'baseAddress.to_address',
      )

      // ------------------------------------------------
      // ----------------- RewardAddress ------------------
      const rewardAddr = await RewardAddress.new(0, paymentCred)

      const pymntCredFromRewardAddr = await rewardAddr.payment_cred()
      const pymntAddrFromRewardPymntCred = await pymntCredFromRewardAddr.to_keyhash()
      assert(
        Buffer.from(await pymntAddrFromRewardPymntCred.to_bytes()).toString(
          'hex',
        ) === pymntAddr,
        'RewardAddress:: -> payment_cred -> keyhash should match original input',
      )
      const rewardAddrFromAddr = await RewardAddress.from_address(
        await rewardAddr.to_address(),
      )
      assert(!!rewardAddrFromAddr, 'rewardAddress.from_address')
      const rewardAddrFromInvalidAddr = await RewardAddress.from_address(
        address,
      )
      assert(
        rewardAddrFromInvalidAddr == null,
        'rewardAddress.from_address (invalid address)',
      )
      const rewardAddrToAddr = await rewardAddrFromAddr.to_address()
      assert(
        Buffer.from(await rewardAddrToAddr.to_bytes(), 'hex').toString(
          'hex',
        ) ===
          Buffer.from(
            await (await rewardAddr.to_address()).to_bytes(),
            'hex',
          ).toString('hex'),
        'rewardAddress.to_address',
      )

      // ------------------------------------------------
      // ------------------ UnitInterval ----------------
      const numeratorStr = '1000000'
      const denominatorStr = '1000000'
      const numeratorBigNum = await BigNum.from_str(numeratorStr)
      const denominatorBigNum = await BigNum.from_str(denominatorStr)
      const unitInterval = await UnitInterval.new(
        numeratorBigNum,
        denominatorBigNum,
      )

      // ------------------------------------------------
      // --------------- TransactionInput ---------------
      const txInput = await TransactionInput.new(txHash, 0)
      assert(
        (await txInput.index()) === 0,
        'TransactionInput:: index should match',
      )
      // prettier-ignore
      assert(
        Buffer.from(
          (await (await txInput.transaction_id()).to_bytes()),
        ).toString('hex') === Buffer.from(txHashToBytes).toString('hex'),
        'TransactionInput:: transaction id should match',
      )

      // ------------------------------------------------
      // -------------- TransactionOutput ---------------
      const amountStr = '1000000'
      const amount = await BigNum.from_str(amountStr)
      const recipientAddr = await Address.from_bytes(baseAddrBytes)
      const txOutput = await TransactionOutput.new(recipientAddr, amount)
      assert(
        txOutput instanceof TransactionOutput,
        'TransactionOutput.new should return instance of TransactionOutput',
      )
      assert(
        (await (await txOutput.amount()).to_str()) === amountStr,
        'TransactionOutput::amount()',
      )
      const outputAddrHex = Buffer.from(
        await (await txOutput.address()).to_bytes(),
      ).toString('hex')
      assert(
        outputAddrHex ===
          Buffer.from(await recipientAddr.to_bytes()).toString('hex'),
        'TransactionOutput::address()',
      )

      // ------------------------------------------------
      // ------------------- LinearFee ------------------
      const coeffStr = '44'
      const constStr = '155381'
      const coeff = await BigNum.from_str(coeffStr)
      const constant = await BigNum.from_str(constStr)
      const fee = await LinearFee.new(coeff, constant)
      assert(
        (await (await fee.coefficient()).to_str()) === coeffStr,
        'LinearFee.coefficient() should match original input',
      )
      assert(
        (await (await fee.constant()).to_str()) === constStr,
        'LinearFee.constant() should match original input',
      )

      // ------------------------------------------------
      // -------------- BootstrapWitnesses --------------
      const bootstrapWits = await BootstrapWitnesses.new()
      assert(
        (await bootstrapWits.len()) === 0,
        'BootstrapWitnesses.len() should return 0',
      )

      // ------------------------------------------------
      // ---------------- Vkeywitnesses -----------------
      const vkeyWits = await Vkeywitnesses.new()
      assert(
        (await vkeyWits.len()) === 0,
        'Vkeywitnesses.len() should return 0',
      )

      // ------------------------------------------------
      // ------------ TransactionWitnessSet -------------
      const witSet = await TransactionWitnessSet.new()

      // ------------------------------------------------
      // ---------------- TransactionBody ---------------
      const bodyHex =
        'a4008282582005ec4a4a7f4645fa66886cef2e34706907a3a7f9d8' +
        '8e0d48b313ad2cdf76fb5f008258206930f123df83e4178b0324ae' +
        '617b2028c0b38c6ff4660583a2abf1f7b08195fe00018182582b82' +
        'd818582183581ce3a1faa5b54bd1485a424d8f9b5e75296b328a2a' +
        '624ef1d2f4c7b480a0001a88e5cdab1913890219042803191c20'
      const txBody = await TransactionBody.from_bytes(
        Buffer.from(bodyHex, 'hex'),
      )

      // ------------------------------------------------
      // -------------------- Utils ---------------------
      const bootstrapWitness = await make_icarus_bootstrap_witness(
        txHash,
        byronAddress,
        bip32PrivateKey,
      )
      assert(
        bootstrapWitness instanceof BootstrapWitness,
        'make_icarus_bootstrap_witness should return instance of BootstrapWitness',
      )
      assert(
        bootstrapWitness.ptr !== undefined,
        'make_icarus_bootstrap_witness:: returns non-undefined',
      )

      const sk = await bip32PrivateKey.to_raw_key()
      const vkeywitness = await make_vkey_witness(txHash, sk)
      assert(
        vkeywitness instanceof Vkeywitness,
        'make_vkey_witness should return instance of Vkeywitness',
      )
      assert(
        vkeywitness.ptr !== undefined,
        'make_vkey_witness:: returns non-undefined',
      )
      assert(
        await vkeywitness.signature(),
        'make_vkey_witness::witness::signature()',
      )

      const hash = await hash_transaction(txBody)
      assert(
        hash instanceof TransactionHash,
        'hash_transaction should return instance of TransactionHash',
      )
      assert(hash.ptr !== undefined, 'hash_transaction:: returns non-undefined')

      // ------------------------------------------------
      // ----------------- Transaction ------------------
      const tx = await Transaction.new(txBody, witSet)
      const bodyBytes = Buffer.from(
        await (await tx.body()).to_bytes(),
      ).toString('hex')
      assert(bodyBytes.length, 'Transaction.body()')

      // tx bytes extracted from yoroi tests
      const txHex =
        '83a4008282582005ec4a4a7f4645fa66886cef2e34706907a3a7f9' +
        'd88e0d48b313ad2cdf76fb5f008258206930f123df83e4178b0324' +
        'ae617b2028c0b38c6ff4660583a2abf1f7b08195fe00018182582b' +
        '82d818582183581ce3a1faa5b54bd1485a424d8f9b5e75296b328a' +
        '2a624ef1d2f4c7b480a0001a88e5cdab1913890219042803191c20' +
        'a102818458208fb03c3aa052f51c086c54bd4059ead2d2e426ac89' +
        'fa4b3ce41cbfd8800b51c0584053685c27ee95dc8e2ea87e6c9e7b' +
        '0557c7d060cc9d18ada7df3c2eec5949011c76e8647b072fe3fa83' +
        '10894f087b097cbb15d7fbcc743100a716bf5df3c6190058202623' +
        'fceb96b07408531a5cb259f53845a38d6b68928e7c0c7e390f0754' +
        '5d0e6241a0f6'
      const txFromBytes = await Transaction.from_bytes(
        Buffer.from(txHex, 'hex'),
      )
      assert(
        Buffer.from(await txFromBytes.to_bytes()).toString('hex') === txHex,
        'Transaction:: -> from_bytes -> to_bytes should match original input',
      )

      // ------------------------------------------------
      // -------------- TransactionBuilder --------------
      // note: changing some of the function parameters will result in some tests
      // failing. Same happens if more inputs/outputs/certificates — or anything
      // that will change the tx size — are added
      const minUtxoVal = await BigNum.from_str('1000000')
      const poolDeposit = await BigNum.from_str('2000000')
      const keyDeposit = await BigNum.from_str('3000000')
      const txBuilder = await TransactionBuilder.new(
        fee,
        minUtxoVal,
        poolDeposit,
        keyDeposit,
      )
      await txBuilder.add_key_input(
        ed25519KeyHash,
        txInput,
        await BigNum.from_str('1000000'),
      )
      await txBuilder.add_bootstrap_input(
        byronAddress,
        txInput,
        await BigNum.from_str('1000000'),
      )
      await txBuilder.add_output(txOutput)
      // commented out so that we can test add_change_if_needed(), which
      // throws if fee has been previously set
      // await txBuilder.set_fee(await BigNum.from_str('500000'))
      const TTL = 10
      await txBuilder.set_ttl(TTL)
      assert(
        (await (await txBuilder.get_explicit_input()).to_str()) === '2000000',
        'TransactionBuilder::get_explicit_input()',
      )
      assert(
        parseInt(await (await txBuilder.get_implicit_input()).to_str(), 10) ===
          0,
        'TransactionBuilder::get_implicit_input()',
      )
      assert(
        (await (await txBuilder.get_explicit_output()).to_str()) === '1000000',
        'TransactionBuilder::get_explicit_output()',
      )
      const changeAddrHex =
        '00' +
        '0000b04c3aa051f51c086c54bd4059ead2d2e426ac89fa4b3ce41cbf' +
        '0000b03c3aa052f51c084c54bd4059ead2d2e426ac89fa4b3ce41cbf'
      const change = await Address.from_bytes(Buffer.from(changeAddrHex, 'hex'))
      assert(
        (await txBuilder.add_change_if_needed(change)) === false,
        'TransactionBuilder::add_change_if_needed()',
      )

      let txBodyFromBuilder = await txBuilder.build()

      assert(
        (await (await txBuilder.min_fee()).to_str()) === '172937',
        'TransactionBuilder::min_fee()',
      )
      assert(
        (await (await txBuilder.get_deposit()).to_str()) === '0',
        'TransactionBuilder::get_fee_or_calc()',
      )
      assert(
        (await (await txBuilder.get_fee_if_set()).to_str()) === '1000000',
        'TransactionBuilder::get_fee_or_calc()',
      )
      await txBuilder.set_certs(certs)

      // ------------------------------------------------
      // -------------- TransactionInputs ---------------
      const inputs = await txBodyFromBuilder.inputs()
      assert((await inputs.len()) === 2, 'TransactionInputs::len()')
      const input = await inputs.get(0)
      assert(input instanceof TransactionInput, 'TransactionInputs::get()')

      // ------------------------------------------------
      // -------------- TransactionOutputs --------------
      const outputs = await txBodyFromBuilder.outputs()
      assert((await outputs.len()) === 1, 'TransactionOutputs::len()')
      const output = await outputs.get(0)
      assert(output instanceof TransactionOutput, 'TransactionOutputs::get()')

      // ------------------------------------------------
      // ------------------ Withdrawals -----------------
      const withdrawals = await Withdrawals.new()
      assert((await withdrawals.len()) === 0, 'Withdrawals::len()')
      const withdrawalAddr = await RewardAddress.from_address(
        await Address.from_bech32(
          'addr1u8pcjgmx7962w6hey5hhsd502araxp26kdtgagakhaqtq8sxy9w7g',
        ),
      )
      // returns coin
      const _oldAmount = await withdrawals.insert(
        withdrawalAddr,
        await BigNum.from_str('10000000'),
      )
      assert(_oldAmount == null, 'Withdrawals::insert()')
      assert((await withdrawals.len()) === 1, 'Withdrawals::len() should be 1')
      assert(
        (await withdrawals.get(withdrawalAddr)) != null,
        'Withdrawals::get()',
      )
      assert(
        (await (await withdrawals.get(withdrawalAddr)).to_str()) === '10000000',
        'Withdrawals::get()',
      )

      const randomAddr = await RewardAddress.from_address(
        await Address.from_bech32(
          'addr1uyvxhwsjarwzr67sutmer7dplwx0jl2czzsp8cvku0wjftgtt8ge9',
        ),
      )
      assert(
        (await withdrawals.get(randomAddr)) == null,
        'Withdrawals::get() must be null for invalid key address',
      )
      assert(
        (await withdrawals.keys()) instanceof RewardAddresses,
        'Withdrawals::keys()',
      )

      // ------------------------------------------------
      // --------------- TransactionBody ----------------
      // addditional TransactionBody tests using previous
      // outputs
      await txBuilder.set_certs(certs)
      await txBuilder.set_withdrawals(withdrawals)

      // re-generate tx body
      txBodyFromBuilder = await txBuilder.build()

      const feeFromTxBody = await txBodyFromBuilder.fee()
      assert(await feeFromTxBody.to_str(), 'TransactionBody::fee()')

      const ttlFromTxBody = await txBodyFromBuilder.ttl()
      assert(ttlFromTxBody === TTL, 'TransactionBody::ttl()')

      const withdrawalsFromTxBody = await txBodyFromBuilder.withdrawals()
      assert(
        (await (await withdrawalsFromTxBody.get(withdrawalAddr)).to_str()) ===
          '10000000',
        'TransactionBody::withdrawals() -> Withdrawals::get()',
      )

      const certsFromTxBody = await txBodyFromBuilder.certs()
      assert(
        (await certsFromTxBody.len()) === 1,
        'TransactionBody::certs() -> Certificates::len()',
      )

      console.log('publicKey', publicKey)
      console.log('bip32PublicKey', bip32PublicKey)
      console.log('bip32PrivateKey', bip32PrivateKey)
      console.log('address', address)
      console.log('ed25519Signature', ed25519Signature)
      console.log('ed25519KeyHash', ed25519KeyHash)
      console.log('txHash', txHash)
      console.log('pymntAddrKeyHash', pymntAddrKeyHash)
      console.log('paymentCred', paymentCred)
      console.log('stakeCred', stakeCred)
      console.log('stakeReg', stakeReg)
      console.log('certificate', cert)
      console.log('baseAddr', baseAddr)
      console.log('rewardAddr', rewardAddr)
      console.log('unitInterval', unitInterval)
      console.log('txInput', txInput)
      console.log('txOutput', txOutput)
      console.log('fee', fee)
      console.log('bootstrapWitness', bootstrapWitness)
      console.log('vkeywitness', vkeywitness)
      console.log('witSet', witSet)
      console.log('txBody', txBody)
      console.log('tx', tx)
      console.log('txBuilder', txBuilder)
      console.log('txBodyFromBuilder', txBodyFromBuilder)
      console.log('inputs', inputs)
      console.log('outputs', outputs)

      /* eslint-disable-next-line react/no-did-mount-set-state */
      this.setState({
        status: 'tests finished',
      })
    } catch (e) {
      console.log(e)
      /* eslint-disable-next-line react/no-did-mount-set-state */
      this.setState({
        status: `error: ${e.message}`,
      })
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>☆HaskellShelley example☆</Text>
        <Text style={styles.instructions}>STATUS: {this.state.status}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
