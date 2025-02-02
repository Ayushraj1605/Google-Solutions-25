import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const Devices = (props) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <G stroke="#000" strokeWidth={3} clipPath="url(#a)">
      <Path
        strokeLinecap="round"
        d="M25.667 11.667c0-4.4 0-6.6-1.367-7.967s-3.567-1.367-7.967-1.367c-4.4 0-6.6 0-7.966 1.367-1.1 1.1-1.315 2.74-1.357 5.633m18.657 7c0 4.4 0 6.6-1.367 7.967s-3.567 1.367-7.967 1.367H14"
      />
      <Path d="M2.333 16.917c0-1.639 0-2.458.394-3.047.17-.254.389-.473.643-.643.589-.394 1.408-.394 3.047-.394 1.638 0 2.457 0 3.046.394.255.17.474.389.644.643.393.589.393 1.408.393 3.047v4.666c0 1.639 0 2.458-.393 3.047-.17.254-.39.473-.644.643-.589.394-1.408.394-3.046.394-1.639 0-2.458 0-3.047-.394a2.333 2.333 0 0 1-.643-.643c-.394-.589-.394-1.408-.394-3.047v-4.666Z" />
      <Path strokeLinecap="round" d="M19.833 22.167H14" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h28v28H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Devices;
