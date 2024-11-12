import { View, Text } from "react-native";
import { SignIn } from "../components/sign-in";
import { useConvexAuth } from "convex/react";
import { Chat } from "../components/chat";
import { Game } from "../components/game";

export default function Index() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <>
      {isAuthenticated ? (
        <View style={{ flex: 1 }}>
          <Chat />
          {/* <Game /> */}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLoading ? <Text>Loading...</Text> : <SignIn />}
        </View>
      )}
    </>
  );
}
