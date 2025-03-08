import 'dotenv/config';

export default {
    expo: {
        name: "E-cycle",
        scheme: "E-cycle",
        slug: "e-cycle",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/logo.png",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        // privacy: "public", // Optional
        ios: {
            supportsTablet: true,
            config: {
                googleMapsApiKey: process.env.IOS_GOOGLE_MAPS_API_KEY || "YOUR_DEFAULT_IOS_KEY"
            }
        },
        android: {
            package: "com.yourcompany.ewaste", // Update this if needed
            adaptiveIcon: {
                foregroundImage: "./assets/images/logo.png",
                backgroundColor: "#ffffff"
            },
            config: {
                googleMaps: {
                    apiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY || "YOUR_DEFAULT_ANDROID_KEY"
                }
            }
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/logo.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/logo.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ],
            [
                "expo-image-picker",
                {
                    "photosPermission": "The app accesses your photos to let you share them with your friends."
                }
            ],
            [
                "expo-location",
                {
                    "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            eas: {
                projectId: "4c67de67-82fa-4d55-a097-33940f1c1755"
            }
        },
        owner: "ayushraj1605"
    }
};
