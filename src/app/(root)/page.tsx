import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { SignedIn, UserButton, currentUser } from "@clerk/nextjs";

export default async function Home() {
  const results = await fetchPosts(1, 30);
  const user = await currentUser();
  console.log(results);

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {results.posts.length === 0 ? (
          <p className="text-base-regular text-light-3">No Thread found</p>
        ) : (
          <>
            {results.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              ></ThreadCard>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
