use super::data::DataPtr;
use super::result::CResult;
use super::string::{CharPtr, IntoCString, IntoStr};
use crate::panic::{handle_exception_result, ToResult, Zip};
use crate::ptr::{RPtr, RPtrRepresentable};
use cddl_lib::address::{BaseAddress, StakeCredential};
use cddl_lib::crypto::{AddrKeyHash};

#[no_mangle]
pub unsafe extern "C" fn base_address_new(
  network: u8, payment: RPtr, stake: RPtr, result: &mut RPtr, error: &mut CharPtr
) -> bool {
  handle_exception_result(|| {
    payment
      .typed_ref::<StakeCredential>()
      // .owned::<StakeCredential>()
      .zip(
        stake.typed_ref::<StakeCredential>()
        // stake.owned::<StakeCredential>()
      )
      .map(|(payment, stake)| {
        BaseAddress::new(network, payment, stake)
      })
    })
    .map(|base_address| base_address.rptr())
    .response(result, error)
}

#[no_mangle]
pub unsafe extern "C" fn base_address_payment_cred(
  base_address: RPtr, result: &mut RPtr, error: &mut CharPtr
) -> bool {
  handle_exception_result(|| {
    base_address
      .typed_ref::<BaseAddress>()
      .map(|base_address| base_address.payment_cred())
    })
    .map(|payment_credential| payment_credential.rptr())
    .response(result, error)
}

#[no_mangle]
pub unsafe extern "C" fn base_address_stake_cred(
  base_address: RPtr, result: &mut RPtr, error: &mut CharPtr
) -> bool {
  handle_exception_result(|| {
    base_address
      .typed_ref::<BaseAddress>()
      .map(|base_address| base_address.stake_cred())
    })
    .map(|stake_credential| stake_credential.rptr())
    .response(result, error)
}
