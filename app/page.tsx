import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

const { VERCEL_DEPLOYMENT_ID } = process.env;

function UploadVideoForm() {
  async function handleCreate(data: FormData) {
    "use server";

    const title = data.get("title");
    if (typeof title !== "string" || !title) {
      throw new Error("Title is required");
    }

    await sql.query(`INSERT INTO posts (title) VALUES ('${title}')`);
    revalidatePath("/");
  }

  return (
    <form className="flex flex-col gap-4 w-full" action={handleCreate}>
      <label
        htmlFor="search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Add new task
      </label>
      <div className="relative">
        <input
          type="title"
          id="title"
          name="title"
          className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Add new task"
          required
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          +
        </button>
      </div>
    </form>
  );
}

type Post = { id: number; title: string };

function PostItem({ post }: { post: Post }) {
  async function handleDelete() {
    "use server";

    await sql`DELETE FROM posts WHERE id = ${post.id}`;
    revalidatePath("/");
  }

  return (
    <form className="" action={handleDelete}>
      <li className="flex items-center justify-between">
        <span>{post.title}</span>
        <button
          type="submit"
          className="px-4 py-2 opacity-50 hover:opacity-100 text-sm font-medium text-white bg-red-700 rounded-lg border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Delete
        </button>
      </li>
    </form>
  );
}

async function PostsList() {
  const { rows: posts } = await sql`SELECT * FROM posts`;

  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border border-gray-300 rounded-lg p-4 bg-gray-50"
        >
          <PostItem post={post as Post} />
        </div>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-20">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex gap-4">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl">
            Demo{" "}
            <code className="font-mono font-bold pl-2">
              OWASP Paris @2024 / shellbear.me
            </code>
          </p>
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:size-auto lg:bg-none"></div>
      </div>

      <div className="flex flex-col items-center justify-center w-full gap-8">
        <div className="relative z-[-1] flex flex-col gap-2 place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <h1 className="text-4xl font-bold z-10">
            <span>Monday 12th, </span>
            <span className="opacity-30">May 2024</span>
          </h1>
          {VERCEL_DEPLOYMENT_ID && (
            <span className="text-sm font-mono text-gray-500">
              {" "}
              (Vercel Deployment ID {VERCEL_DEPLOYMENT_ID})
            </span>
          )}
        </div>

        <div className="mb-32 flex flex-col text-center w-full justify-center lg:mb-0 lg:w-1/3 gap-4">
          <UploadVideoForm />
          <PostsList />
        </div>
      </div>
    </main>
  );
}
