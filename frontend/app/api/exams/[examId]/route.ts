import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return new NextResponse(null, { status: 501 });
}

export async function PATCH(): Promise<NextResponse> {
  return new NextResponse(null, { status: 501 });
}

export async function DELETE(): Promise<NextResponse> {
  return new NextResponse(null, { status: 501 });
}
