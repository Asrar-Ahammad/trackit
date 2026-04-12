import { View, Text } from 'react-native'
import React from 'react'
import { Link, useLocalSearchParams } from 'expo-router'

const subscriptionDetails = () => {
    const { id } = useLocalSearchParams<{id: string}>()
  return (
    <View className='items-center justify-center h-screen'>
      <Text>subscriptionDetails : {id}</Text>
      <Link href={"/"} className="bg-accent p-4 text-white font-bold rounded mt-4">Go back</Link>
    </View>
  )
}

export default subscriptionDetails