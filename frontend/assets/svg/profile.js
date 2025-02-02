import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const Profile = (props) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <G
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      clipPath="url(#a)"
    >
      <Path
        d="M14.14 14.91a1.12 1.12 0 0 0-.28 0 3.814 3.814 0 0 1-3.686-3.815 3.821 3.821 0 0 1 3.827-3.827 3.829 3.829 0 0 1 3.827 3.827 3.822 3.822 0 0 1-3.687 3.815Z"
        opacity={0.4}
      />
      <Path
        d="M21.863 22.61A11.59 11.59 0 0 1 14 25.667a11.59 11.59 0 0 1-7.864-3.057c.117-1.096.817-2.17 2.065-3.01 3.197-2.123 8.424-2.123 11.597 0 1.248.84 1.948 1.913 2.065 3.01Z"
        opacity={0.34}
      />
      <Path d="M14 25.667c6.443 0 11.667-5.224 11.667-11.667S20.443 2.333 14 2.333 2.333 7.557 2.333 14 7.557 25.667 14 25.667Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h28v28H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Profile
