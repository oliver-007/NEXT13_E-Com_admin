import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request, // 'req' must be the 1st argument & necessary to write.
  { params }: { params: { categoryId: string } } // {params} must be the 2nd argument.
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[Category_GET]", error);
    return new NextResponse("Intarnal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("UnAuthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required.", { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[ category_patch ]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request, // 'req' must be the 1st argument & necessary to write.
  { params }: { params: { storeId: string; categoryId: string } } // {params} must be the 2nd argument.
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
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
    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[Category_delete]", error);
    return new NextResponse("Intarnal Error", { status: 500 });
  }
}
