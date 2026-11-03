import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "IMGBB_API_KEY environment variable is not configured" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No image file provided for upload" },
        { status: 400 }
      );
    }

    const imgbbForm = new FormData();
    imgbbForm.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbForm,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return NextResponse.json(
        { message: data?.error?.message || "Image upload to ImgBB failed" },
        { status: res.status || 500 }
      );
    }

    const imageUrl = data.data.display_url || data.data.url;
    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}

