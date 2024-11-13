import { View, Text } from "react-native";
import { SignIn } from "../components/sign-in";
import { useConvexAuth, useQuery } from "convex/react";
import { Chat } from "../components/chat";
import { api } from "../../convex/_generated/api";

export default function Index() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const features = useQuery(api.features.getFeatures);
  return (
    <>
      {isAuthenticated ? (
        <View
          style={{
            flex: 1,
            ...(features?.chatEnabled
              ? {}
              : { justifyContent: "center", alignItems: "center" }),
          }}
        >
          {features?.chatEnabled ? (
            <Chat />
          ) : (
            <Text>Chat will be enabled after the Convex intro</Text>
          )}
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
