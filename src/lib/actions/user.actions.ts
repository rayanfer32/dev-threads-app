"use server";

import { revalidatePath } from "next/cache";
import { User } from "../models/user.model";
import { connectToDB } from "../mongoose";
import { Thread } from "../models/thread.model";

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

  return await User.findOne({ id: userId });
  // .populate({
  //   path: "communities",
  //   model: Community,
  // });
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // find all threads authored by user with the given userId

    // todo: populate community
    const threads =  User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          mode: User,
          select: "name image id",
        },
      },
    });
    return threads;
  } catch (error) {
    throw new Error(`Error fetching user posts: ${error}`);
  }
}
