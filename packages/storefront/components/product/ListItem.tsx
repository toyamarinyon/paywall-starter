import Link from "next/link";
import { Product } from "@paywall-content-platform/prisma";
export function ProductListItem({ id, name }: Product) {
  return (
    <article className="bg-white rounded flex-1 shadow">
      <Link href={`/products/${id}`}>
        <a className="flex p-4">
          <div>{name}</div>
        </a>
      </Link>
    </article>
  );
}
