import { Text } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const SignOut = () => {
  const user = useQuery(api.users.getAuthenticatedUser);

  if (!user) {
    return null;
  }

  return <Text>{user.name}</Text>;
};
