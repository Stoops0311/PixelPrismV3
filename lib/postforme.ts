import type {
  SocialAccount,
  GetAuthUrlResponse,
  CreateUploadUrlResponse,
  Post,
  CreatePostRequest,
  CreatePostResponse,
  UpdatePostRequest,
  PostStatusResponse,
  PostResult,
  AccountAnalytics,
  PostAnalytics,
  GetAccountAnalyticsRequest,
  WebhookPayload,
  PostForMeErrorData,
  PostForMePlatform,
  RateLimitInfo,
} from "@/types/postforme";

const POSTFORME_API_BASE = process.env.POSTFORME_API_BASE || "https://api.postforme.dev/v1";
const POSTFORME_API_KEY = process.env.POSTFORME_API_KEY || "";

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export const POSTFORME_PLATFORMS = {
  INSTAGRAM: "instagram",
  FACEBOOK: "facebook",
  X: "x",
  LINKEDIN: "linkedin",
  PINTEREST: "pinterest",
} as const;

class PostForMeError extends Error {
  status: number;
  code: string;
  requestId: string;
  details?: Record<string, unknown>;

  constructor(error: PostForMeErrorData) {
    super(error.message);
    this.name = "PostForMeError";
    this.status = error.status;
    this.code = error.code;
    this.requestId = error.requestId;
    this.details = error.details;
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  attempt = 1
): Promise<T> {
  const url = `${POSTFORME_API_BASE}${endpoint}`;
  const timeout = options.signal ? undefined : DEFAULT_TIMEOUT;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${POSTFORME_API_KEY}`,
    ...((options.headers as Record<string, string>) || {}),
  };

  const controller = new AbortController();
  const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    if (timeoutId) clearTimeout(timeoutId);

    const rateLimit: RateLimitInfo = {
      limit: parseInt(response.headers.get("X-RateLimit-Limit") || "100"),
      remaining: parseInt(response.headers.get("X-RateLimit-Remaining") || "99"),
      resetAt: response.headers.get("X-RateLimit-Reset") || new Date().toISOString(),
    };

    if (!response.ok) {
      const errorData: PostForMeErrorData = await response.json().catch(() => ({
        status: response.status,
        code: "UNKNOWN_ERROR",
        message: `HTTP ${response.status}: ${response.statusText}`,
        requestId: response.headers.get("X-Request-Id") || "unknown",
      }));

      const shouldRetry =
        attempt < DEFAULT_RETRIES &&
        (response.status === 429 ||
          response.status >= 500 ||
          errorData.code === "RATE_LIMITED" ||
          errorData.code === "INTERNAL_ERROR");

      if (shouldRetry) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        await sleep(delay);
        return makeRequest<T>(endpoint, options, attempt + 1);
      }

      throw new PostForMeError(errorData);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);

    if (error instanceof PostForMeError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new PostForMeError({
        status: 408,
        code: "TIMEOUT",
        message: "Request timeout",
        requestId: "unknown",
      });
    }

    if (attempt < DEFAULT_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      await sleep(delay);
      return makeRequest<T>(endpoint, options, attempt + 1);
    }

    throw new PostForMeError({
      status: 500,
      code: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Network error",
      requestId: "unknown",
    });
  }
}

export async function getSocialAuthUrl(
  platform: PostForMePlatform,
  redirectUrl?: string
): Promise<string> {
  const fallbackAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await makeRequest<GetAuthUrlResponse>("/social-accounts/auth-url", {
    method: "POST",
    body: JSON.stringify({
      platform,
      redirect_url_override:
        redirectUrl || `${fallbackAppUrl}/dashboard/connect-callback`,
      permissions: ["posts", "feeds"],
    }),
  });
  return response.url;
}

export async function getConnectedAccounts(): Promise<SocialAccount[]> {
  const response = await makeRequest<{ data?: SocialAccount[]; items?: SocialAccount[] }>(
    "/social-accounts"
  );
  return response.data || response.items || [];
}

export async function disconnectAccount(accountId: string): Promise<void> {
  await makeRequest<void>(`/social-accounts/${accountId}/disconnect`, {
    method: "POST",
  });
}

export async function createConnectedAccount(
  platform: PostForMePlatform,
  accessToken: string,
  userId: string
): Promise<SocialAccount> {
  return makeRequest<SocialAccount>("/social-accounts", {
    method: "POST",
    body: JSON.stringify({
      platform,
      user_id: userId,
      access_token: accessToken,
      access_token_expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }),
  });
}

export async function refreshAccountToken(accountId: string): Promise<SocialAccount> {
  return makeRequest<SocialAccount>(`/social-accounts/${accountId}`);
}

export async function uploadMedia(file: File): Promise<string> {
  const uploadResponse = await makeRequest<CreateUploadUrlResponse>("/media/create-upload-url", {
    method: "POST",
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    }),
  });

  const uploadUrl = uploadResponse.uploadUrl || uploadResponse.upload_url || "";
  const mediaUrl = uploadResponse.mediaUrl || uploadResponse.media_url || "";

  const uploadResult = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResult.ok) {
    throw new PostForMeError({
      status: uploadResult.status,
      code: "UPLOAD_FAILED",
      message: `Failed to upload media: ${uploadResult.statusText}`,
      requestId: "unknown",
    });
  }

  return mediaUrl;
}

export async function uploadMediaFromUrl(mediaUrl: string): Promise<string> {
  const response = await makeRequest<CreateUploadUrlResponse>("/media/create-upload-url", {
    method: "POST",
    body: JSON.stringify({ sourceUrl: mediaUrl }),
  });
  return response.mediaUrl || response.media_url || "";
}

export async function createPost(params: {
  content: string;
  mediaUrls: string[];
  targetAccountIds: string[];
  scheduledFor?: Date;
}): Promise<CreatePostResponse> {
  const request: CreatePostRequest = {
    caption: params.content,
    social_accounts: params.targetAccountIds,
    media: params.mediaUrls.map((url) => ({ url })),
    scheduled_at: params.scheduledFor?.toISOString(),
    content: params.content,
    mediaUrls: params.mediaUrls,
    targetAccountIds: params.targetAccountIds,
    scheduledFor: params.scheduledFor?.toISOString(),
  };

  return makeRequest<CreatePostResponse>("/social-posts", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updatePost(
  postId: string,
  updates: {
    content?: string;
    mediaUrls?: string[];
    targetAccountIds?: string[];
    scheduledFor?: Date | null;
  }
): Promise<void> {
  const request: UpdatePostRequest = {
    caption: updates.content,
    social_accounts: updates.targetAccountIds,
    media: updates.mediaUrls?.map((url) => ({ url })),
    scheduled_at:
      updates.scheduledFor === null ? null : updates.scheduledFor?.toISOString(),
    content: updates.content,
    mediaUrls: updates.mediaUrls,
    targetAccountIds: updates.targetAccountIds,
    scheduledFor: updates.scheduledFor === null ? null : updates.scheduledFor?.toISOString(),
  };

  Object.keys(request).forEach((key) => {
    if (request[key as keyof UpdatePostRequest] === undefined) {
      delete (request as Record<string, unknown>)[key];
    }
  });

  await makeRequest<void>(`/social-posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deletePost(postId: string): Promise<void> {
  await makeRequest<void>(`/social-posts/${postId}`, {
    method: "DELETE",
  });
}

export async function getPost(postId: string): Promise<Post> {
  return makeRequest<Post>(`/social-posts/${postId}`);
}

export async function publishNow(postId: string): Promise<void> {
  await makeRequest<void>(`/social-posts/${postId}/publish`, {
    method: "POST",
  });
}

export async function getPostResults(postId: string): Promise<PostResult[]> {
  const response = await makeRequest<{ data?: PostResult[]; items?: PostResult[] }>(
    `/social-post-results?post_id[]=${encodeURIComponent(postId)}`
  );
  return response.data || response.items || [];
}

export async function getPostStatus(postId: string): Promise<PostStatusResponse> {
  const post = await makeRequest<any>(`/social-posts/${postId}`);
  const results = await getPostResults(postId);
  return {
    postId,
    status: post.status,
    results,
    scheduledFor: post.scheduled_at,
    publishedAt: post.published_at,
    progress: {
      total: results.length,
      completed: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status === "failed").length,
      pending: results.filter((r) => r.status === "pending").length,
    },
  };
}

export async function getAccountAnalytics(
  accountId: string,
  dateRange?: { start: Date; end: Date }
): Promise<AccountAnalytics> {
  const params = new URLSearchParams();
  params.append("expand[]", "metrics");

  if (dateRange) {
    params.append("start_date", dateRange.start.toISOString());
    params.append("end_date", dateRange.end.toISOString());
  }

  return makeRequest<AccountAnalytics>(`/social-account-feeds/${accountId}?${params.toString()}`);
}

export async function getPostAnalytics(postId: string): Promise<PostAnalytics> {
  await getPostResults(postId);
  return {
    postId,
    platformResults: [],
    aggregated: {
      impressions: 0,
      reach: 0,
      engagements: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      saves: 0,
    },
    lastUpdated: new Date().toISOString(),
  } as PostAnalytics;
}

export async function getAnalyticsForDateRange(
  params: GetAccountAnalyticsRequest
): Promise<AccountAnalytics> {
  const searchParams = new URLSearchParams({
    start_date: params.startDate,
    end_date: params.endDate,
  });

  if (params.granularity) {
    searchParams.append("granularity", params.granularity);
  }

  return makeRequest<AccountAnalytics>(
    `/social-account-feeds/${params.accountId}?${searchParams.toString()}`
  );
}

export function verifyWebhookSignature(
  _payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) return false;
  const a = new TextEncoder().encode(signature.trim());
  const b = new TextEncoder().encode(secret.trim());
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

export function parseWebhookPayload(payload: string): WebhookPayload {
  return JSON.parse(payload);
}

export { PostForMeError };
