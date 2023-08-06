import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request, // 'req' must be the 1st argument & necessary to write.
  { params }: { params: { colorId: string } } // {params} must be the 2nd argument.
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[Colors_GET]", error);
    return new NextResponse("Intarnal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("UnAuthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse("Color ID is required.", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("UnAuthorized", { status: 403 });
    }

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[ Colors_patch ]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request, // 'req' must be the 1st argument & necessary to write.
  { params }: { params: { storeId: string; colorId: string } } // {params} must be the 2nd argument.
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("UnAuthorized", { status: 403 });
    }

    // for checking 2 conditions we must use 'deleteMany()' . 'delete()' supports only 1 condition.
    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[Color_delete]", error);
    return new NextResponse("Intarnal Error", { status: 500 });
  }
}
