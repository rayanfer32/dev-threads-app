"use server";

import { revalidatePath } from "next/cache";
import { User } from "../models/user.model";
import { connectToDB } from "../mongoose";

type Params = {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
};

export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: Params): Promise<void> {
  await connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    console.log("user created");

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  connectToDB();

  return await User.findOne({ id: userId })
  // .populate({
  //   path: "communities",
  //   model: Community,
  // });
}
