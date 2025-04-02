import 'dotenv/config';

export default {
    expo: {
        name: "Eco-Sankalp",
        scheme: "Eco-Sankalp",
        slug: "e-waste",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/logo.png",
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
                foregroundImage: "./assets/logo.png",
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
            favicon: "./assets/logo.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/logo.png",
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
                projectId: "d02a87e5-01ad-42d9-a97e-b65efd589493"
            }
        },
        owner: "ayushraj1605"
    }
};
