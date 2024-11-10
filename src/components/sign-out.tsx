import { Text } from "react-native";
import { useCurrentUser } from "../stores/user";

export const SignOut = () => {
  //   const user = useCurrentUser();
  const user = undefined;
  return <>{user && <Text>{user.name}</Text>}</>;
};
