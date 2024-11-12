import { View, Text, StyleSheet, Image } from "react-native";
import { Doc } from "../../../convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const Message = ({
  item,
  currentUser,
  users,
}: {
  item: Doc<"messages">;
  currentUser: Doc<"users">;
  users: Doc<"users">[];
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(
    item.expiresAt ? Math.round((item.expiresAt - Date.now()) / 1000) : 0
  );
  const imageUrl = item.storageId
    ? useQuery(api.messages.getImageUrl, { storageId: item.storageId })
    : null;
  useEffect(() => {
    if (!item.expiresAt) return;

    const interval = setInterval(() => {
      if (!item.expiresAt) return;
      const newTimeLeft = Math.round((item.expiresAt - Date.now()) / 1000);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [item.expiresAt]);
  return (
    <View
      style={[
        styles.messageBubble,
        item.userId === currentUser?._id
          ? styles.sentMessage
          : styles.receivedMessage,
      ]}
    >
      <Text style={styles.senderName}>
        {users?.find((u) => u._id === item.userId)?.name}
      </Text>
      <Text style={styles.messageText}>{item.content}</Text>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 200, height: 200, borderRadius: 8, marginTop: 8 }}
        />
      )}
      <Text style={styles.time}>
        {new Date(item._creationTime).toLocaleTimeString()}
      </Text>
      {item.expiresAt && (
        <Text
          style={{
            ...styles.time,
            bottom: "auto",
            top: 10,
          }}
        >
          🗑️ {timeLeft}s
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    paddingRight: 70,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  senderName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  time: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});
