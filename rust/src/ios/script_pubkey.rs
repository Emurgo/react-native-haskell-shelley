use super::result::CResult;
use super::string::{CharPtr};
use crate::panic::{handle_exception_result};
use crate::ptr::{RPtr, RPtrRepresentable};
use super::data::DataPtr;
use cardano_serialization_lib::crypto::{Ed25519KeyHash};
use cardano_serialization_lib::{ScriptPubkey};


#[no_mangle]
pub unsafe extern "C" fn script_pubkey_addr_keyhash(
  script_pubkey: RPtr, result: &mut RPtr, error: &mut CharPtr
) -> bool {
  handle_exception_result(|| {
    script_pubkey
      .typed_ref::<ScriptPubkey>()
      .map(|script_pubkey| script_pubkey.addr_keyhash())
  })
    .map(|key_hash| key_hash.rptr())
    .response(result, error)
}

#[no_mangle]
pub unsafe extern "C" fn script_pubkey_new(
  addr_keyhash: RPtr, result: &mut RPtr, error: &mut CharPtr
) -> bool {
  handle_exception_result(|| {
    addr_keyhash
      .typed_ref::<Ed25519KeyHash>()
      .map(|addr_keyhash| ScriptPubkey::new(addr_keyhash))
  })
    .map(|script_pubkey| script_pubkey.rptr())
    .response(result, error)
}
