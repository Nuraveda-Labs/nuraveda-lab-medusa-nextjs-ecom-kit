import { cookies } from "next/headers";
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from "@/lib/medusa";

const COOKIE_NAME = "sb_customer";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type CustomerProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  has_account: boolean;
};

export type CustomerAddress = {
  id: string;
  address_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
};

export type CustomerOrder = {
  id: string;
  display_id: number;
  status: string;
  payment_status?: string | null;
  fulfillment_status?: string | null;
  currency_code: string;
  total: number;
  created_at: string;
  email?: string;
  items?: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    subtitle?: string | null;
    thumbnail?: string | null;
    metadata?: Record<string, unknown> | null;
  }>;
  shipping_address?: CustomerAddress;
  metadata?: Record<string, unknown> | null;
};

export async function getCustomerToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value ?? null;
}

export async function setCustomerToken(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearCustomerToken() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

async function storeFetch<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type") && init.body) headers.set("content-type", "application/json");
  headers.set("x-publishable-api-key", MEDUSA_PUBLISHABLE_KEY);
  if (token) headers.set("authorization", `Bearer ${token}`);
  const response = await fetch(new URL(path, MEDUSA_BACKEND_URL), {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Medusa ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function authFetch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(new URL(path, MEDUSA_BACKEND_URL), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new Error(payload?.message || `Medusa auth ${response.status}`);
  }
  return payload as T;
}

export async function loginCustomer(email: string, password: string): Promise<string> {
  const data = await authFetch<{ token?: string }>("/auth/customer/emailpass", { email, password });
  if (!data.token) throw new Error("Invalid email or password.");
  return data.token;
}

type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
};

export async function registerCustomer(input: RegisterInput): Promise<string> {
  const { token: registrationToken } = await authFetch<{ token?: string; message?: string }>(
    "/auth/customer/emailpass/register",
    { email: input.email, password: input.password },
  );
  if (!registrationToken) throw new Error("Unable to register — account may already exist.");

  await storeFetch<unknown>(
    "/store/customers",
    {
      method: "POST",
      body: JSON.stringify({
        first_name: input.firstName,
        last_name: input.lastName ?? "",
        email: input.email,
        ...(input.phone ? { phone: input.phone } : {}),
      }),
    },
    registrationToken,
  );

  return loginCustomer(input.email, input.password);
}

export async function getCurrentCustomer(): Promise<CustomerProfile | null> {
  const token = await getCustomerToken();
  if (!token) return null;
  try {
    const { customer } = await storeFetch<{ customer: CustomerProfile }>("/store/customers/me", {}, token);
    return customer;
  } catch {
    return null;
  }
}

export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const token = await getCustomerToken();
  if (!token) return [];
  try {
    const { orders = [] } = await storeFetch<{ orders: CustomerOrder[] }>(
      "/store/orders?limit=50&order=-created_at&fields=*items,*shipping_address",
      {},
      token,
    );
    return orders;
  } catch {
    return [];
  }
}

export async function getCustomerOrder(id: string): Promise<CustomerOrder | null> {
  const token = await getCustomerToken();
  if (!token) return null;
  try {
    const { order } = await storeFetch<{ order: CustomerOrder }>(
      `/store/orders/${id}?fields=*items,*shipping_address,*billing_address`,
      {},
      token,
    );
    return order;
  } catch {
    return null;
  }
}

export async function updateCustomer(input: Partial<{ first_name: string; last_name: string; phone: string }>) {
  const token = await getCustomerToken();
  if (!token) throw new Error("Not signed in.");
  await storeFetch("/store/customers/me", { method: "POST", body: JSON.stringify(input) }, token);
}
