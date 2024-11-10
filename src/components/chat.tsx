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

interface Message {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: Date;
  senderName: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isSent: true,
      timestamp: new Date(),
      senderName: "You",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    flatListRef.current?.scrollToEnd();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.isSent ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.senderName}>{item.senderName}</Text>
      <Text style={styles.messageText}>{item.text}</Text>
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
        keyExtractor={(item) => item.id}
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
    alignSelf: "flex-end",
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
});
