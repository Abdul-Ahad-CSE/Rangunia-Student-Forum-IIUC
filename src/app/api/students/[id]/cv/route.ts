import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response("Missing student identifier", { status: 400 });
    }

    // 1. Fetch StudentProfile by userId, profile id, or studentId
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        OR: [
          { userId: id },
          { id: id },
          { user: { studentId: { equals: id, mode: "insensitive" } } },
        ],
      },
      include: {
        user: {
          select: {
            fullName: true,
            studentId: true,
          },
        },
      },
    });

    if (!studentProfile || !studentProfile.cvUrl) {
      return new Response("Curriculum Vitae (PDF) document not found or not uploaded.", {
        status: 404,
      });
    }

    // Sanitize file name for Content-Disposition header
    const cleanName = (studentProfile.user?.fullName || "Student")
      .trim()
      .replace(/[^a-zA-Z0-9_\-\s]/g, "")
      .replace(/\s+/g, "_");
    const filename = `${cleanName}_CV.pdf`;

    // Check if cvUrl is a Cloudinary / remote URL
    if (studentProfile.cvUrl.startsWith("http://") || studentProfile.cvUrl.startsWith("https://")) {
      try {
        const upstreamRes = await fetch(studentProfile.cvUrl);
        if (upstreamRes.ok) {
          const arrayBuffer = await upstreamRes.arrayBuffer();
          return new Response(arrayBuffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename="${filename}"`,
              "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
          });
        }
      } catch (fetchErr) {
        console.warn("Could not stream remote CV, redirecting to URL:", fetchErr);
      }
      return Response.redirect(studentProfile.cvUrl, 302);
    }

    // Legacy Base64 fallback: Strip Data URI prefix if present
    const base64Data = studentProfile.cvUrl.replace(/^data:application\/pdf;base64,/, "");

    // Convert Base64 string to native binary Buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Return native binary streaming PDF response
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error streaming CV document:", error);
    return new Response("An internal error occurred while retrieving the CV document.", {
      status: 500,
    });
  }
}
