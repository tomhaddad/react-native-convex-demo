import { Text, View } from "react-native";
import { SignIn } from "../components/sign-in";
import { useConvexAuth } from "convex/react";
import { Chat } from "../components/chat";

export default function Index() {
  const { isAuthenticated } = useConvexAuth();
  return (
    <>
      {isAuthenticated ? (
        <View style={{ flex: 1 }}>
          <Chat />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SignIn />
        </View>
      )}
    </>
  );
}
