import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const Organisations = (props) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <G stroke="#000" strokeLinecap="round" clipPath="url(#a)">
      <Path
        strokeWidth={3}
        d="M25.667 25.667H2.333M24.5 25.667v-10.5M12.838 5.833c.021-1.446.129-2.266.679-2.816.683-.684 1.783-.684 3.983-.684h2.333c2.2 0 3.3 0 3.984.684C24.5 3.7 24.5 4.8 24.5 7v3.5"
      />
      <Path
        strokeWidth={3}
        d="M17.5 25.667v-7m-14 7v-10.5m0-4.667c0-2.2 0-3.3.683-3.983.684-.684 1.784-.684 3.984-.684h4.666c2.2 0 3.3 0 3.984.684.683.683.683 1.783.683 3.983V14M10.5 25.667v-3.5"
      />
      <Path
        strokeWidth={2}
        d="M7 9.333h7M7 12.833h1.167m5.833 0h-2.917M7 16.333h7"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h28v28H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Organisations;
