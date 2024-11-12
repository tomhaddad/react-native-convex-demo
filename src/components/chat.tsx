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
  Keyboard,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Message } from "./chat/message";
import * as ImagePicker from "expo-image-picker";

export const Chat = () => {
  const [inputText, setInputText] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [inputStorageId, setInputStorageId] = useState<
    Id<"_storage"> | undefined
  >(undefined);
  const flatListRef = useRef<FlatList>(null);
  const users = useQuery(api.users.getUsers);
  const messages = useQuery(api.messages.getMessages);
  const convex = useConvex();
  const currentUser = useQuery(api.users.getAuthenticatedUser);

  const [expires, setExpires] = useState(false);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    convex
      .mutation(api.messages.createMessage, {
        content: inputText,
        expires,
        storageId: inputStorageId,
      })
      .then(() => {
        setInputText("");
        setExpires(false);
        setInputStorageId(undefined);
        flatListRef.current?.scrollToEnd();
      });
  };

  const renderMessage = ({ item }: { item: Doc<"messages"> }) => (
    <Message item={item} currentUser={currentUser!} users={users!} />
  );

  const handleImageUpload = async () => {
    setInputStorageId(undefined);
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You need to allow access to your photos to share images.");
      return;
    }

    // Pick image - Simplified options
    const result = await ImagePicker.launchImageLibraryAsync();
    setImageUploading(true);

    if (!result.canceled) {
      // Generate upload URL
      const uploadUrl = await convex.mutation(api.messages.generateUploadUrl);

      // Upload the image
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: await fetch(result.assets[0].uri).then((res) => res.blob()),
      });

      if (!response.ok) {
        console.error(response);
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      const res = await response.json();
      setInputStorageId(res.storageId);
    }
    setImageUploading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        style={{ flex: 1 }}
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />
      <View
        style={styles.inputContainer}
        onLayout={() =>
          Keyboard.addListener("keyboardDidShow", () => {
            setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
          })
        }
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              ...styles.imageButton,
              backgroundColor: inputStorageId ? "#25D366" : "#f0f2f5",
            }}
            onPress={() => {
              if (imageUploading || inputStorageId) return;
              handleImageUpload();
            }}
          >
            <Ionicons
              name={imageUploading ? "cloud-upload-outline" : "image-outline"}
              size={20}
              color={inputStorageId ? "#FFFFFF" : "#999"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.expirationButton,
              backgroundColor: expires ? "#25D366" : "#f0f2f5",
            }}
            onPress={() => setExpires(!expires)}
          >
            <Ionicons
              name="timer-outline"
              size={20}
              color={expires ? "#FFFFFF" : "#999"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
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
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginBottom: Platform.OS === "ios" ? 30 : 0,
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expirationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#f0f2f5",
    marginBottom: Platform.OS === "ios" ? 0 : 2,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#f0f2f5",
    marginBottom: Platform.OS === "ios" ? 0 : 2,
  },
});
