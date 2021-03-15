import { Product } from ".prisma/client";
import { useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = async function <JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
};

export function useProductToken(product: Product) {
  const [session, sessionLoading] = useSession();
  const [hasProductToken, setHasProductToken] = useState(false);
  const { data: user, error } = useSWR<{ hasProductToken: boolean }>(
    () =>
      `/api/user/productToken/?userAccessToken=${session.accessToken}&productId=${product.id}`,
    fetcher
  );
  useEffect(() => {
    setHasProductToken(user?.hasProductToken);
  }, [user]);

  return { loading: sessionLoading || (session && !user), hasProductToken };
}
