import { SignedPostPolicyV4Output } from "@google-cloud/storage";
import { useState } from "react";

async function uploadImage(files: FileList): Promise<string> {
  const res = await fetch(`/api/upload-url`);
  const { url, fields } = (await res.json()) as SignedPostPolicyV4Output;

  const formData = new FormData();
  const file = files[0];
  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const publicUrlRes = await fetch(`/api/public-url?file=${fields.key}`);

  if (!upload.ok) {
    throw new Error();
  }
  console.log("Uploaded successfully!");
  console.log(`filename: ${fields.key}`);
  const { publicUrl } = (await publicUrlRes.json()) as { publicUrl: string };
  console.log(`publicUrl: ${publicUrl}`);
  return publicUrl;
}
function NewProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [cover, setCover] = useState<FileList>(undefined);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        uploadImage(cover)
          .catch(() => {
            console.error("file upload failed.");
          })
          .then((coverUrl) => {
            if (!coverUrl) {
              return;
            }
            fetch("/api/products/create", {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                name,
                description,
                amount,
                coverUrl
              }),
            });
          });
      }}
    >
      <label htmlFor="name">名前</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="description">説明</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="amount">金額</label>
      <input
        type="text"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
      <label htmlFor="cover"></label>
      <input
        type="file"
        name="cover"
        id="cover"
        onChange={(e) => setCover(e.target.files)}
      />
      <button type="submit">送信</button>
    </form>
  );
}

export default NewProduct;
