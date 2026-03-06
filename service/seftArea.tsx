import { Dimensions } from "react-native";

import { initialWindowMetrics } from "react-native-safe-area-context";

export const safeArea = {
  width:
    Dimensions.get("window").width -
    (initialWindowMetrics?.insets.left ?? 0) -
    (initialWindowMetrics?.insets.right ?? 0),
  height:
    Dimensions.get("window").height -
    (initialWindowMetrics?.insets.top ?? 0) -
    (initialWindowMetrics?.insets.bottom ?? 0),
  insets: initialWindowMetrics?.insets,
};
