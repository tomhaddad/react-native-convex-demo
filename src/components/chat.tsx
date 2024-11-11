import { useConvex, useQuery } from "convex/react";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

const getRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
};

export const Chat = () => {
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const users = useQuery(api.users.getUsers);
  const messages = useQuery(api.messages.getMessages);
  const convex = useConvex();
  const currentUser = useQuery(api.users.getAuthenticatedUser);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    convex
      .mutation(api.messages.createMessage, {
        content: inputText,
      })
      .then(() => {
        setInputText("");
        flatListRef.current?.scrollToEnd();
      });
  };

  const renderMessage = ({ item }: { item: Doc<"messages"> }) => (
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
      <Text style={styles.time}>
        {new Date(item._creationTime).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    paddingRight: 50,
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
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginBottom: Platform.OS === "ios" ? 30 : 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: "center",
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: "#25D366",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: Platform.OS === "ios" ? 0 : 2,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
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
