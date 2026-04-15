import { Text } from 'react-native'
import React from 'react'
import { SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from 'nativewind'
const SafeAreaView = styled(RNSafeAreaView);

const Onboarding = () => {
  return (
    <SafeAreaView>
      <Text>Onboarding</Text>
    </SafeAreaView>
  )
}

export default Onboarding