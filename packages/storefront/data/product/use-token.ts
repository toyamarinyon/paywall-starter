import { BillingStatus, Product } from ".prisma/client";
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
  const [billingStatus, setBillingStatus] = useState<BillingStatus>();
  const [hasPaidProductToken, setHasPaidProductToken] = useState(false);
  const [hasOpenProductToken, setHasOpenProductToken] = useState(false);
  const { data: user, error } = useSWR<{
    hasProductToken: boolean;
    billingStatus?: BillingStatus;
  }>(
    () =>
      `/api/user/productToken/?userAccessToken=${session.accessToken}&productId=${product.id}`,
    fetcher
  );
  useEffect(() => {
    if (!user) {
      return;
    }
    setHasProductToken(user.hasProductToken);
    setBillingStatus(user.billingStatus);
    setHasPaidProductToken(
      user.hasProductToken && user.billingStatus === "paid"
    );
    setHasOpenProductToken(
      user.hasProductToken && user.billingStatus === "open"
    );
  }, [user]);

  return {
    loading: sessionLoading || (session && !user),
    hasProductToken,
    billingStatus,
    hasPaidProductToken,
    hasOpenProductToken,
  };
}
