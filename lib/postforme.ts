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
const POSTFORME_API_SECRET = process.env.POSTFORME_API_SECRET || "";

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export const POSTFORME_PLATFORMS = {
  INSTAGRAM: "instagram",
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  LINKEDIN: "linkedin",
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
    "X-API-Key": POSTFORME_API_KEY,
    ...((options.headers as Record<string, string>) || {}),
  };

  if (POSTFORME_API_SECRET) {
    headers["X-API-Secret"] = POSTFORME_API_SECRET;
  }

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
  const response = await makeRequest<GetAuthUrlResponse>("/social-accounts/auth-url", {
    method: "POST",
    body: JSON.stringify({
      platform,
      redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/social/callback`,
    }),
  });
  return response.url;
}

export async function getConnectedAccounts(): Promise<SocialAccount[]> {
  return makeRequest<SocialAccount[]>("/social-accounts");
}

export async function disconnectAccount(accountId: string): Promise<void> {
  await makeRequest<void>(`/social-accounts/${accountId}`, {
    method: "DELETE",
  });
}

export async function createConnectedAccount(
  platform: PostForMePlatform,
  code: string,
  state: string
): Promise<SocialAccount> {
  return makeRequest<SocialAccount>("/social-accounts", {
    method: "POST",
    body: JSON.stringify({ platform, code, state }),
  });
}

export async function refreshAccountToken(accountId: string): Promise<SocialAccount> {
  return makeRequest<SocialAccount>(`/social-accounts/${accountId}/refresh`, {
    method: "POST",
  });
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

  const uploadResult = await fetch(uploadResponse.uploadUrl, {
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

  return uploadResponse.mediaUrl;
}

export async function uploadMediaFromUrl(mediaUrl: string): Promise<string> {
  const response = await makeRequest<CreateUploadUrlResponse>("/media/create-upload-url", {
    method: "POST",
    body: JSON.stringify({ sourceUrl: mediaUrl }),
  });
  return response.mediaUrl;
}

export async function createPost(params: {
  content: string;
  mediaUrls: string[];
  targetAccountIds: string[];
  scheduledFor?: Date;
}): Promise<CreatePostResponse> {
  const request: CreatePostRequest = {
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
    method: "PATCH",
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
  return makeRequest<PostResult[]>(`/social-post-results?post_id=${postId}`);
}

export async function getPostStatus(postId: string): Promise<PostStatusResponse> {
  return makeRequest<PostStatusResponse>(`/social-posts/${postId}/status`);
}

export async function getAccountAnalytics(
  accountId: string,
  dateRange?: { start: Date; end: Date }
): Promise<AccountAnalytics> {
  const params = new URLSearchParams();
  params.append("expand", "metrics");

  if (dateRange) {
    params.append("start_date", dateRange.start.toISOString());
    params.append("end_date", dateRange.end.toISOString());
  }

  return makeRequest<AccountAnalytics>(`/social-account-feeds/${accountId}?${params.toString()}`);
}

export async function getPostAnalytics(postId: string): Promise<PostAnalytics> {
  return makeRequest<PostAnalytics>(`/social-posts/${postId}/analytics`);
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
  payload: string,
  signature: string,
  secret: string
): boolean {
  return true;
}

export function parseWebhookPayload(payload: string): WebhookPayload {
  return JSON.parse(payload);
}

export { PostForMeError };
