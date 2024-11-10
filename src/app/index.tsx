import { Text, View } from "react-native";
import { SignIn } from "../components/sign-in";
import { useConvexAuth } from "convex/react";

export default function Index() {
  const { isAuthenticated } = useConvexAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isAuthenticated ? <Text>Signed in</Text> : <SignIn />}
    </View>
  );
}
