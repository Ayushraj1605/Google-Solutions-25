import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileImage = ({ name }) => {
  const nameParts = name.split(' ');
  const firstNameInitial = nameParts[0] ? nameParts[0][0] : '';
//   const lastNameInitial = nameParts[1] ? nameParts[1][0] : '';

  return (
    <View style={styles.profileImage}>
      <Text style={styles.initials}>
        {firstNameInitial}
        {/* {lastNameInitial} */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50, // Half of width/height to create a circle
    backgroundColor: 'brown',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
  },
});

export default ProfileImage;
