import React from 'react';
import { Alert, PermissionsAndroid, Text } from 'react-native';
// import CameraButton from '../../components/camerabutton';
// import { SafeAreaView } from 'react-native-safe-area-context';

const CameraPress = async () => {
//   try {
//     // Check if the camera permission is already granted
//     // const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
//     // if (isGranted) {
//     //   console.log('Camera permission already granted');
//     //   return;
//     // }

//     // Request the camera permission with a rationale
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//       {
//         title: 'APPNAME',
//         message: 'This function needs camera permission.',
//         buttonPositive: 'OK',
//         buttonNegative: 'Cancel',
//         buttonNeutral: 'Ask Me Later',
//       },
//     );

//     console.log('Permission result:', granted);

//     // Handle the possible results
//     if (granted === PermissionsAndroid.RESULTS.granted) {
//       console.log('You can use the camera');
//     } else if (granted === PermissionsAndroid.RESULTS.denied) {
//       console.log('Camera permission denied');
//     } else if (granted === PermissionsAndroid.RESULTS.never_ask_again) {
//       console.log('Camera permission set to never ask again');
//       Alert.alert(
//         'Permission Required',
//         'Camera permission is required. Please enable it in settings.',
//         [{ text: 'OK' }]
//       );
//     }
//   } catch (err) {
//     console.warn(err);
//   }
};

const Deviceinfo = () => {
  return (
    <SafeAreaView className="w-full h-full items-center bg-white">
      {/* <CameraButton handlePress={CameraPress} /> */}
      <Text>hi</Text>
    </SafeAreaView>
  );
};

export default Deviceinfo;
