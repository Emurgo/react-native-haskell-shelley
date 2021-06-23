use super::primitive::ToPrimitiveObject;
use super::ptr_j::*;
use super::result::ToJniResult;
use crate::panic::{handle_exception_result};
use crate::ptr::RPtrRepresentable;
use jni::objects::JObject;
use jni::sys::{jobject, jint, jbyteArray};
use jni::JNIEnv;
use cardano_serialization_lib::crypto::{Ed25519KeyHash};
use cardano_serialization_lib::{ScriptPubkey};

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_io_emurgo_rnhaskellshelley_Native_scriptPubkeyAddrKeyhash(
  env: JNIEnv, _: JObject, ptr: JRPtr
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr.typed_ref::<ScriptPubkey>().and_then(|script_pubkey| script_pubkey.addr_keyhash().rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_io_emurgo_rnhaskellshelley_Native_scriptPubkeyNew(
  env: JNIEnv, _: JObject, addr_keyhash: JRPtr
) -> jobject {
  handle_exception_result(|| {
    let addr_keyhash = addr_keyhash.rptr(&env)?;
    addr_keyhash
      .typed_ref::<Ed25519KeyHash>()
      .map(|key_hash| ScriptPubkey::new(key_hash))
      .and_then(|script_pubkey| script_pubkey.rptr().jptr(&env))
  })
  .jresult(&env)
}
