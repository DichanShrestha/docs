import { clerkClient } from "@clerk/clerk-sdk-node";

export async function checkUserExists(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return { exists: false, message: "User not found" };
    }

    return true;
  } catch (error: any) {
    return false;
  }
}
