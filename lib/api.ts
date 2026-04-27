import { NextResponse } from "next/server";

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(
  message: string,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status });
}
