import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request, // 'req' must be the 1st argument & necessary to write.
  { params }: { params: { productId: string } } // {params} must be the 2nd argument.
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // for checking 2 conditions we must use 'deleteMany()' . 'delete()' supports only 1 condition.
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        color: true,
        size: true,
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[Product_GET]", error);
    return new NextResponse("Intarnal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      images,
      price,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("UnAuthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!images) {
      return new NextResponse("Images is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is Required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category Id is Required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size Id is Required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color Id is Required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required.", { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        images: {
          deleteMany: {},
        },
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[ Product_patch ]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request, // 'req' must be the 1st argument & necessary to write.
  { params }: { params: { storeId: string; productId: string } } // {params} must be the 2nd argument.
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
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
    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[Product_delete]", error);
    return new NextResponse("Intarnal Error", { status: 500 });
  }
}
