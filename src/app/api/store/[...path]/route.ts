import { NextRequest, NextResponse } from "next/server";
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from "@/lib/medusa";

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  if (!MEDUSA_PUBLISHABLE_KEY) {
    return NextResponse.json({ error: "Medusa publishable key is not configured." }, { status: 500 });
  }

  const { path } = await params;
  const upstream = new URL(`/store/${path.join("/")}`, MEDUSA_BACKEND_URL);
  upstream.search = request.nextUrl.search;

  const headers = new Headers();
  headers.set("x-publishable-api-key", MEDUSA_PUBLISHABLE_KEY);
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    const body = await request.text();
    if (body) {
      init.body = body;
    }
  }

  const response = await fetch(upstream, init);
  const body = await response.text();
  const nextHeaders = new Headers();
  const responseType = response.headers.get("content-type");
  if (responseType) {
    nextHeaders.set("content-type", responseType);
  }

  return new NextResponse(body, {
    status: response.status,
    headers: nextHeaders,
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}
