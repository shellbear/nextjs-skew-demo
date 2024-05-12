```tsx
// Typo in "tittle"
function UploadVideoForm() {
  async function handleCreate(data: FormData) {
    "use server";

    const title = data.get("tittle");
    if (typeof title !== "string" || !title) {
      throw new Error("Title is required");
    }

    await sql.query(`INSERT INTO posts (title) VALUES ('${title}')`);
    revalidatePath("/");
  }

  return (
    <form action={handleCreate}>
      <input name="tittle" placeholder="Add new task" required />
      <button type="submit">+</button>
    </form>
  );
}
```

```tsx
// Fixed example "tittle" -> "title"
function UploadVideoForm() {
  async function handleCreate(data: FormData) {
    "use server";
    f;
    const title = data.get("title");
    if (typeof title !== "string" || !title) {
      throw new Error("Title is required");
    }

    await sql.query(`INSERT INTO posts (title) VALUES ('${title}')`);
    revalidatePath("/");
  }

  return (
    <form action={handleCreate}>
      <input name="title" placeholder="Add new task" required />
      <button type="submit">+</button>
    </form>
  );
}
```

```tsx
// Vulnerable
await sql.query(`INSERT INTO posts (title) VALUES ('${title}')`);
```

```tsx
// Fixed and prevent injections
await sql`INSERT INTO posts (title) VALUES (${title})`;
```

```http
------WebKitFormBoundaryFXNNiV2PDNn48h7K
Content-Disposition: form-data; name="1_$ACTION_ID_968176b0d3bc937266eab3301ee323fb82f66641"


------WebKitFormBoundaryFXNNiV2PDNn48h7K
Content-Disposition: form-data; name="1_title"

example
------WebKitFormBoundaryFXNNiV2PDNn48h7K
Content-Disposition: form-data; name="0"

["$K1"]
------WebKitFormBoundaryFXNNiV2PDNn48h7K--
```

```ts
const r = await fetch("/get", {
  headers: {
    // Ensures the request will be handled by the expected
    // deployment.
    "X-Deployment-Id": deploymentId,
  },
});
```
