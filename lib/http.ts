import { toast } from "sonner";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  skipAuthRedirect?: boolean;
}

export async function http<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuthRedirect, ...fetchOptions } = options;

  let url = endpoint;
  if (!url.startsWith("http")) {
    if (!url.startsWith("/server-api")) {
      url = `/server-api${url.startsWith("/") ? "" : "/"}${url}`;
    }
  }

  const headers = new Headers(fetchOptions.headers || {});
  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    credentials: "include",
    ...fetchOptions,
    headers,
  });

  let data: any = null;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await res.text();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      `Request failed with status ${res.status}`;

    if (res.status === 401 && !skipAuthRedirect && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        toast.error("Session expired. Please log in again.");
        const redirectUrl = `/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`;
        window.location.href = redirectUrl;
      }
    }

    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

http.get = <T = any>(url: string, options?: RequestOptions) =>
  http<T>(url, { ...options, method: "GET" });

http.post = <T = any>(url: string, body?: any, options?: RequestOptions) =>
  http<T>(url, {
    ...options,
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

http.put = <T = any>(url: string, body?: any, options?: RequestOptions) =>
  http<T>(url, {
    ...options,
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

http.patch = <T = any>(url: string, body?: any, options?: RequestOptions) =>
  http<T>(url, {
    ...options,
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

http.delete = <T = any>(url: string, options?: RequestOptions) =>
  http<T>(url, { ...options, method: "DELETE" });

