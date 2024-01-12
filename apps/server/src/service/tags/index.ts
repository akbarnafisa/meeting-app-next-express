import { prismaClient } from "../../application/database";

export const getTagsService = async () => {
  const tags = await prismaClient.tags.findMany({
    include: {
      _count: {
        select: {
          articles: true,
        },
      },
    },
    skip: 0,
    take: 10,
    orderBy: { articles: { _count: "desc" } },
  });

  return tags;
};
