import { Button, Text, View } from "react-native";
import { SignIn } from "../components/sign-in";
import { useConvexAuth } from "convex/react";
import { Chat } from "../components/chat";
import { TextInput } from "react-native";
import { useState } from "react";
import { useUserStore } from "../stores/user";

export default function Index() {
  const { isAuthenticated } = useConvexAuth();
  const [name, setName] = useState("");
  const { setUser } = useUserStore();
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
          <Text>or</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <Button title="Set name" onPress={() => setUser({ name })} />
        </View>
      )}
    </>
  );
}
