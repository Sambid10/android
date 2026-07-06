import React from 'react';
import { Pressable, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Fonts } from '../themes/font';
import { getFontSize } from '../themes/scaleFont';

export default function Button({
    title,
    icon: Icon,
    onPress,
}: {
    title: string;
    icon?: LucideIcon;
    onPress: () => void;
}) {
    return (
       <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
        height: 35,
        backgroundColor: '#A82323',
        borderRadius: 99,
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: pressed ? 0.7 : 1, 
    })}
>
            {Icon && <Icon size={getFontSize(14)} color="white" />}
            <Text style={{ color: 'white' ,fontFamily:Fonts.semiBold,fontSize:getFontSize(14)}}>{title}</Text>
        </Pressable>
    );
}