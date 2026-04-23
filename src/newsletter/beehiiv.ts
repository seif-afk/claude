const BASE_URL = "https://api.beehiiv.com/v2";

export interface BeehiivConfig {
  apiKey: string;
  publicationId?: string;
}

export interface Publication {
  id: string;
  name: string;
  organization_name?: string;
  referral_program_enabled?: boolean;
  created?: number;
}

export interface CreatePostParams {
  title: string;
  subtitle?: string;
  body_content: string;
  status?: "draft" | "confirmed";
  scheduled_at?: string;
  thumbnail_image_url?: string;
  email_settings?: {
    subject_line?: string;
    preview_text?: string;
  };
  recipients?: {
    tiers?: string[];
    audience?: "free" | "premium" | "all";
    platform?: "web" | "email" | "both";
  };
  content_tags?: string[];
}

export interface CreatePostResponse {
  data: { id: string } & Record<string, unknown>;
}

export class BeehiivError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown,
  ) {
    super(message);
    this.name = "BeehiivError";
  }
}

export class BeehiivClient {
  constructor(private cfg: BeehiivConfig) {
    if (!cfg.apiKey) throw new Error("BEEHIIV_API_KEY is required");
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.cfg.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let parsed: unknown = undefined;
    try {
      parsed = text ? JSON.parse(text) : undefined;
    } catch {
      parsed = text;
    }

    if (!res.ok) {
      throw new BeehiivError(
        `Beehiiv ${method} ${path} failed: ${res.status} ${res.statusText}`,
        res.status,
        parsed,
      );
    }
    return parsed as T;
  }

  listPublications(): Promise<{ data: Publication[] }> {
    return this.request("GET", "/publications");
  }

  createPost(publicationId: string, params: CreatePostParams): Promise<CreatePostResponse> {
    return this.request("POST", `/publications/${publicationId}/posts`, params);
  }
}
