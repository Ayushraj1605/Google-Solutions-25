import 'dotenv/config';

export default {
    expo: {
        name: "E-waste",
        scheme: "E-waste",
        slug: "E-waste",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            config: {
                googleMapsApiKey: process.env.IOS_GOOGLE_MAPS_API_KEY
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            config: {
                googleMaps: {
                    apiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY
                }
            }
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
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
        }
    }
};
