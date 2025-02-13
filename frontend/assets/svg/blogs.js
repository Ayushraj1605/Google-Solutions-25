import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Blogs = (props) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={2}
      d="m13.74 11.667 5.634 1.51M12.833 15.047l3.381.906"
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={3}
      d="M23.697 14.755c-.705 2.631-1.058 3.947-1.857 4.8a4.666 4.666 0 0 1-2.346 1.354 3.243 3.243 0 0 1-.343.061c-1.068.132-2.37-.217-4.742-.853-2.63-.705-3.946-1.057-4.8-1.856a4.666 4.666 0 0 1-1.354-2.346c-.265-1.139.087-2.454.792-5.085l.604-2.254c.101-.378.195-.73.285-1.056.53-1.944.887-3.013 1.571-3.744a4.666 4.666 0 0 1 2.347-1.354c1.138-.266 2.454.087 5.085.792 2.63.705 3.946 1.057 4.8 1.856a4.667 4.667 0 0 1 1.354 2.347c.188.805.066 1.698-.27 3.083"
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M3.818 19.422c.705 2.63 1.057 3.946 1.856 4.8a4.667 4.667 0 0 0 2.346 1.354c1.139.265 2.454-.087 5.085-.792 2.631-.705 3.947-1.058 4.8-1.857a4.666 4.666 0 0 0 1.246-1.957M9.936 7.52c-.412.106-.862.227-1.36.36-2.631.705-3.946 1.057-4.8 1.856a4.666 4.666 0 0 0-1.354 2.347c-.188.805-.067 1.699.27 3.084"
    />
  </Svg>
)
export default Blogs
