import { useState } from "react";

function NewProduct() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  return (
    <form
      onSubmit={() => {
        fetch("/api/products/create", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            amount,
          }),
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
      <label htmlFor="amount">金額</label>
      <input
        type="text"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
      <button type="submit">送信</button>
    </form>
  );
}

export default NewProduct;
