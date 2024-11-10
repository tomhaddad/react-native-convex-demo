import { useConvexAuth, useQuery } from "convex/react";
import { create } from "zustand";
import { api } from "../../convex/_generated/api";

export interface User {
  name: string;
}

interface UserStore {
  user?: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (user: User) => set({ user }),
}));

export const useCurrentUser = (): User | null => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) return null;
  if (isAuthenticated) {
    const user = useQuery(api.users.getAuthenticatedUser);
    if (!user) throw new Error("User is not authenticated");
    return {
      name: user.name!,
    };
  }
  const user = useUserStore((state) => state.user);

  if (!user) {
    throw new Error("User is not logged in");
  }

  return user;
};
