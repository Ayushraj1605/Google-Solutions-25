import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import '../global.css'


const CustomButton = ({title,handlePress, containerStyles, textStyles, isLoading}) => {
    return (

        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`rounded-full min-h-[62px] w-11/12 justify-center items-center ${containerStyles}`}
        >
            <Text className='font-semibold text-lg text-white'>{ title }</Text>
        </TouchableOpacity>
    )
}
export default CustomButton;