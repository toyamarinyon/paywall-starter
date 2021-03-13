import Image from "next/image";
import Link from "next/link";
import { Product } from "@paywall-content-platform/prisma";
export function ProductListItem({ id, name, coverUrl }: Product) {
  return (
    <article className="bg-white rounded flex-1 shadow">
      <Link href={`/products/${id}`}>
        <a className="flex flex-col p-4">
          <div className="relative h-24">
            <Image src={coverUrl} layout="fill" objectFit="contain" />
          </div>
          <div>{name}</div>
        </a>
      </Link>
    </article>
  );
}
