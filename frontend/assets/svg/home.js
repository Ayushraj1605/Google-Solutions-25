import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Home = (props) => (
  <Svg
    width={27}
    height={27}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={3}
      d="M16.375 20.805h-5.75M25 13.735v1.749c0 4.486 0 6.729-1.347 8.122C22.305 25 20.137 25 15.8 25h-4.6c-4.337 0-6.505 0-7.853-1.394C2 22.213 2 19.97 2 15.484v-1.75c0-2.631 0-3.947.597-5.038.597-1.09 1.688-1.768 3.87-3.122l2.3-1.427C11.073 2.716 12.226 2 13.5 2c1.274 0 2.427.716 4.733 2.147l2.3 1.427c2.182 1.354 3.273 2.031 3.87 3.122"
    />
  </Svg>
)
export default Home;
