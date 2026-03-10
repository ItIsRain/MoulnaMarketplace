import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB raw upload limit
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB for videos
const VALID_FOLDERS = ["logos", "banners", "story", "products", "gallery", "workshop", "admin", "moments"];

// Max dimensions per folder type — Cloudinary will resize on upload
const FOLDER_LIMITS: Record<string, { width: number; height: number }> = {
  products: { width: 1200, height: 1200 },
  logos: { width: 512, height: 512 },
  banners: { width: 1920, height: 600 },
  gallery: { width: 1600, height: 1200 },
  story: { width: 1200, height: 800 },
  workshop: { width: 1600, height: 1200 },
  admin: { width: 1920, height: 800 },
  moments: { width: 1080, height: 1920 },
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = formData.get("folder") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPEG, PNG, WebP, MP4, MOV, WebM." },
      { status: 400 }
    );
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${isVideo ? "50MB" : "10MB"}.` },
      { status: 400 }
    );
  }

  const targetFolder = VALID_FOLDERS.includes(folder || "") ? folder! : "misc";

  // Build folder path: moulna/{shop_slug_or_user_id}/{folder}
  // Admin uploads go to moulna/admin/{folder}
  let folderOwner = user.id;

  if (targetFolder === "admin") {
    // Verify user is admin
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    folderOwner = "admin";
  } else {
    // Try to get shop slug for the folder path
    const admin = createAdminClient();
    const { data: shop } = await admin
      .from("shops")
      .select("slug")
      .eq("owner_id", user.id)
      .single();

    if (shop?.slug) {
      folderOwner = shop.slug;
    }
  }

  const cloudinaryFolder = `moulna/${folderOwner}/${targetFolder}`;
  const limits = FOLDER_LIMITS[targetFolder] || { width: 1200, height: 1200 };

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadOptions: Record<string, unknown> = {
      folder: cloudinaryFolder,
      resource_type: isVideo ? "video" : "image",
    };

    if (isVideo) {
      // Video: limit duration to 60s, auto quality
      uploadOptions.transformation = [
        { duration: "60", quality: "auto" },
      ];
    } else {
      uploadOptions.transformation = [
        {
          width: limits.width,
          height: limits.height,
          crop: "limit",
          quality: "auto:good",
          fetch_format: "auto",
        },
      ];
    }

    const result = await cloudinary.uploader.upload(base64, uploadOptions);

    // For video, also return a thumbnail (jpg poster frame)
    const response: Record<string, string> = { url: result.secure_url };
    if (isVideo && result.public_id) {
      // Build thumbnail URL: replace /video/upload/ with /video/upload/c_fill,w_600,h_800,so_0/
      // and append .jpg to force image format
      const thumbUrl = result.secure_url
        .replace("/video/upload/", "/video/upload/c_fill,w_600,h_800,so_0/")
        .replace(/\.[^.]+$/, ".jpg");
      response.thumbnail = thumbUrl;
      response.mediaType = "video";
    } else {
      response.mediaType = "image";
    }

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("Cloudinary upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
