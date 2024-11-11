import { Text } from "react-native";
import { useCurrentUser } from "../stores/user";

export const SignOut = () => {
  const user = useCurrentUser();

  if (!user) {
    return null;
  }

  return <Text>{user.name}</Text>;
};
