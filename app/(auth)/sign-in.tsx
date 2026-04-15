import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signIn= () => {
  return (
    <View className='items-center justify-center h-screen'>
      <Text>sign-in</Text>
      <Link href={"/"} className='bg-primary p-4 text-white rounded-2xl'> Home</Link>
    </View>
  )
}

export default signIn