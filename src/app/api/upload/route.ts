import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB raw upload limit
const VALID_FOLDERS = ["logos", "banners", "story", "products", "gallery", "workshop", "admin"];

// Max dimensions per folder type — Cloudinary will resize on upload
const FOLDER_LIMITS: Record<string, { width: number; height: number }> = {
  products: { width: 1200, height: 1200 },
  logos: { width: 512, height: 512 },
  banners: { width: 1920, height: 600 },
  gallery: { width: 1600, height: 1200 },
  story: { width: 1200, height: 800 },
  workshop: { width: 1600, height: 1200 },
  admin: { width: 1920, height: 800 },
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

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 10MB." },
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

    const result = await cloudinary.uploader.upload(base64, {
      folder: cloudinaryFolder,
      resource_type: "image",
      transformation: [
        {
          width: limits.width,
          height: limits.height,
          crop: "limit", // Resize only if larger, preserving aspect ratio
          quality: "auto:good",
          fetch_format: "auto",
        },
      ],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("Cloudinary upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
