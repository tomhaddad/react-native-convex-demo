import { View, Text, Pressable, Animated, Dimensions } from "react-native";
import { useState, useEffect, useCallback } from "react";

type Dot = {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  scale: Animated.Value;
  opacity: Animated.Value;
};

type PopText = {
  id: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
};

// Get screen dimensions
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const Game = () => {
  const [dots, setDots] = useState<Dot[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [popTexts, setPopTexts] = useState<PopText[]>([]);

  // Start game and handle timer
  const startGame = useCallback(() => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setDots([]);
  }, []);

  // Handle game timer
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  // Spawn dots randomly
  useEffect(() => {
    if (!gameActive) return;

    const spawnDot = () => {
      const newDot: Dot = {
        id: Date.now(),
        x: ((Math.random() * 80 + 10) * windowWidth) / 100, // 10% to 90% of width
        y: ((Math.random() * 70 + 15) * windowHeight) / 100, // 15% to 85% of height
        timestamp: Date.now(),
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
      };
      setDots((prev) => [...prev, newDot]);
    };

    const spawnInterval = setInterval(
      () => {
        spawnDot();
      },
      500 + Math.random() * 1000
    ); // Random spawn between 0.5-1.5 seconds

    return () => clearInterval(spawnInterval);
  }, [gameActive]);

  // Remove dots after 5 seconds
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setDots((prev) => prev.filter((dot) => now - dot.timestamp < 5000));
    }, 100);

    return () => clearInterval(cleanup);
  }, []);

  const handlePress = (dotId: number) => {
    const dot = dots.find((d) => d.id === dotId);
    if (!dot) return;

    // Create pop text animation
    const popText: PopText = {
      id: Date.now(),
      x: dot.x,
      y: dot.y,
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    };

    setPopTexts((prev) => [...prev, popText]);

    // Animate pop text
    Animated.parallel([
      Animated.timing(popText.opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(popText.translateY, {
        toValue: -50,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPopTexts((prev) => prev.filter((p) => p.id !== popText.id));
    });

    // Original dot disappearance animation
    Animated.parallel([
      Animated.timing(dot.scale, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(dot.opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDots((prev) => prev.filter((d) => d.id !== dotId));
      setScore((prev) => prev + 1);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text>Score: {score}</Text>
        <Text>Time: {timeLeft}s</Text>
      </View>

      {!gameActive && (
        <Pressable
          onPress={startGame}
          style={{
            padding: 15,
            backgroundColor: "#4CAF50",
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Start Game</Text>
        </Pressable>
      )}

      {popTexts.map((pop) => (
        <Animated.Text
          key={pop.id}
          style={{
            position: "absolute",
            left: pop.x,
            top: pop.y,
            opacity: pop.opacity,
            transform: [{ translateY: pop.translateY }],
            fontSize: 16,
            fontWeight: "bold",
            color: "#FF4444",
          }}
        >
          WHAM!
        </Animated.Text>
      ))}

      {dots.map((dot) => (
        <Animated.View
          key={dot.id}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y,
            opacity: dot.opacity,
            transform: [
              {
                scale: dot.scale.interpolate({
                  inputRange: [1, 1.5],
                  outputRange: [1 + (Date.now() - dot.timestamp) / 2000, 1.5],
                }),
              },
            ],
          }}
        >
          <Pressable
            onPress={() => handlePress(dot.id)}
            style={{
              width: 20,
              height: 20,
              backgroundColor: "red",
              borderRadius: 50,
            }}
          />
        </Animated.View>
      ))}
    </View>
  );
};
