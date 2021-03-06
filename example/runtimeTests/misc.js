// @flow

import {BigNum, UnitInterval} from '@emurgo/react-native-haskell-shelley'

import {assert} from '../util'

const test: () => void = async () => {
  /**
   * UnitInterval
   */
  const numeratorStr = '1000000'
  const denominatorStr = '1000000'
  const numeratorBigNum = await BigNum.from_str(numeratorStr)
  const denominatorBigNum = await BigNum.from_str(denominatorStr)
  const unitInterval = await UnitInterval.new(
    numeratorBigNum,
    denominatorBigNum,
  )
  assert(unitInterval instanceof UnitInterval, 'UnitInterval::new()')
}

export default test
