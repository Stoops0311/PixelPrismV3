/**
 * PostForMe API Types
 * 
 * TypeScript interfaces for PostForMe social media API integration.
 */

export type PostForMePlatform = "instagram" | "facebook" | "twitter" | "linkedin";

export const POSTFORME_PLATFORMS: Record<string, PostForMePlatform> = {
  INSTAGRAM: "instagram",
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  LINKEDIN: "linkedin",
} as const;

export interface SocialAccount {
  id: string;
  platform: PostForMePlatform;
  name: string;
  handle: string;
  avatarUrl?: string;
  permissions: string[];
  connectedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface GetAuthUrlRequest {
  platform: PostForMePlatform;
  redirectUrl?: string;
  state?: string;
}

export interface GetAuthUrlResponse {
  url: string;
  state: string;
  expiresAt: string;
}

export interface OAuthCallbackData {
  platform: PostForMePlatform;
  code: string;
  state: string;
}

export interface CreateUploadUrlResponse {
  uploadUrl: string;
  mediaUrl: string;
  expiresAt: string;
  mediaId: string;
}

export interface MediaMetadata {
  mediaId: string;
  mediaUrl: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

export type PostStatus = "draft" | "scheduled" | "publishing" | "published" | "failed";

export interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  targetAccountIds: string[];
  status: PostStatus;
  scheduledFor?: string;
  publishedAt?: string;
  results: PostResult[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
  mediaUrls: string[];
  targetAccountIds: string[];
  scheduledFor?: string;
}

export interface CreatePostResponse {
  postId: string;
  status: PostStatus;
  message?: string;
}

export interface UpdatePostRequest {
  content?: string;
  mediaUrls?: string[];
  targetAccountIds?: string[];
  scheduledFor?: string | null;
}

export interface PostResult {
  accountId: string;
  platform: PostForMePlatform;
  postUrl?: string;
  status: "pending" | "success" | "failed";
  error?: string;
  postedAt?: string;
}

export interface PostStatusResponse {
  postId: string;
  status: PostStatus;
  results: PostResult[];
  scheduledFor?: string;
  publishedAt?: string;
  progress: {
    total: number;
    completed: number;
    failed: number;
    pending: number;
  };
}

export interface EngagementMetrics {
  impressions: number;
  reach: number;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  saves: number;
  videoViews?: number;
  watchTime?: number;
  profileVisits?: number;
  followerChange?: number;
}

export interface AccountAnalytics {
  accountId: string;
  platform: PostForMePlatform;
  dateRange: {
    start: string;
    end: string;
  };
  summary: EngagementMetrics;
  daily: Array<{
    date: string;
    metrics: EngagementMetrics;
  }>;
  topPosts: Array<{
    postId: string;
    content: string;
    mediaUrl?: string;
    metrics: EngagementMetrics;
    publishedAt: string;
  }>;
  audience?: {
    followers: number;
    following: number;
    ageDistribution?: Record<string, number>;
    genderDistribution?: Record<string, number>;
    locationDistribution?: Record<string, number>;
  };
}

export interface PostAnalytics {
  postId: string;
  platformResults: Array<{
    accountId: string;
    platform: PostForMePlatform;
    postUrl: string;
    metrics: EngagementMetrics;
    collectedAt: string;
  }>;
  aggregated: EngagementMetrics;
  lastUpdated: string;
}

export interface GetAccountAnalyticsRequest {
  accountId: string;
  startDate: string;
  endDate: string;
  granularity?: "day" | "week" | "month";
}

export type WebhookEventType = 
  | "post.status.updated"
  | "post.published"
  | "post.failed"
  | "account.connected"
  | "account.disconnected"
  | "account.token_refreshed"
  | "analytics.updated";

export interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  webhookId: string;
  data: WebhookEventData;
}

export type WebhookEventData =
  | PostStatusWebhookData
  | PostPublishedWebhookData
  | PostFailedWebhookData
  | AccountConnectedWebhookData
  | AccountDisconnectedWebhookData
  | AccountTokenRefreshedWebhookData
  | AnalyticsUpdatedWebhookData;

export interface PostStatusWebhookData {
  postId: string;
  status: PostStatus;
  previousStatus: PostStatus;
  results?: PostResult[];
  updatedAt: string;
}

export interface PostPublishedWebhookData {
  postId: string;
  accountId: string;
  platform: PostForMePlatform;
  postUrl: string;
  publishedAt: string;
}

export interface PostFailedWebhookData {
  postId: string;
  accountId: string;
  platform: PostForMePlatform;
  error: string;
  failedAt: string;
}

export interface AccountConnectedWebhookData {
  accountId: string;
  platform: PostForMePlatform;
  name: string;
  handle: string;
  connectedAt: string;
}

export interface AccountDisconnectedWebhookData {
  accountId: string;
  platform: PostForMePlatform;
  disconnectedAt: string;
  reason?: string;
}

export interface AccountTokenRefreshedWebhookData {
  accountId: string;
  platform: PostForMePlatform;
  refreshedAt: string;
  expiresAt?: string;
}

export interface AnalyticsUpdatedWebhookData {
  postId: string;
  accountId: string;
  platform: PostForMePlatform;
  metrics: EngagementMetrics;
  collectedAt: string;
}

export interface WebhookSignature {
  timestamp: string;
  signature: string;
  version: string;
}

export interface PostForMeErrorData {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId: string;
}

export type PostForMeErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "PLATFORM_ERROR"
  | "TOKEN_EXPIRED"
  | "INSUFFICIENT_PERMISSIONS"
  | "INVALID_MEDIA"
  | "SCHEDULING_ERROR"
  | "INTERNAL_ERROR";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: PostForMeErrorData;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

export interface PostForMeConfig {
  apiKey: string;
  apiSecret?: string;
  baseUrl: string;
  webhookSecret?: string;
  timeout?: number;
  retries?: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: string;
}
