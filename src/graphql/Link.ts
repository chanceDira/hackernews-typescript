
import { extendType, nonNull, objectType, stringArg, intArg, inputObjectType, enumType, arg, list } from "nexus";
import { Prisma } from "@prisma/client"

export const Link = objectType({
    name: "Link", // 1 
    definition(t) {  // 2
        t.nonNull.int("id"); // 3 
        t.nonNull.string("description"); // 4
        t.nonNull.string("url"); // 5 

        t.field("postedBy", {   // 1
            type: "User",
            resolve(parent, args, context) {  // 2
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
        t.nonNull.list.nonNull.field("voters", {  // 1
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .voters();
            }
        }) 
    },
});

export const Feed = objectType({
    name: "Feed",
    definition(t) {
        t.nonNull.list.nonNull.field("links", { type: Link }); // 1
        t.nonNull.int("count"); // 2
        t.id("id");  // 3
    },
});

// let links: NexusGenObjects["Link"][]= [   // 1
//     {
//         id: 1,
//         url: "www.howtographql.com",
//         description: "Fullstack tutorial for GraphQL",
//     },
//     {
//         id: 2,
//         url: "graphql.org",
//         description: "GraphQL official website",
//     },
// ];

export const LinkOrderByInput = inputObjectType({
    name: "LinkOrderByInput",
    definition(t) {
        t.field("description", { type: Sort });
        t.field("url", { type: Sort });
    },
});

export const Sort = enumType({
    name: "Sort",
    members: ["asc", "desc"],
});

export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            args: {
                filter: stringArg(),
                skip: intArg(),   
                take: intArg(),
                orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }),  // 1
            },
            resolve(parent, args, context) {
                const where = args.filter
                    ? {
                        OR: [
                            { description: { contains: args.filter } },
                            { url: { contains: args.filter } },
                        ],
                    }
                    : {};
                return context.prisma.link.findMany({
                    where,
                    skip: args?.skip as number | undefined,    
                    take: args?.take as number | undefined,
                    orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined,  // 2
                });
            },
        });
    },
});



export const singleLinkQuery = extendType({  // 2
    type: "Query",
    definition(t) {
        t.field("link", {   // 3
            type: "Link",
            args: {   // 3
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {    // 4
                const { id } = args; 
                const singleLink = context.prisma.link.findUnique({
                    where: {
                     id: id,
                    },
                  })
                    return singleLink
            },
        });
    },
});

export const deleteLinkQuery = extendType({  // 2
    type: "Mutation",
    definition(t) {
        t.nonNull.field("deleteLink", {   // 3
            type: "Link",
            args: {   // 3
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {    // 4
                const { id } = args; 
                const deleteLink = context.prisma.link.delete({
                    where: {
                      id: id,
                    },
                  })
                  return deleteLink
            },
        });
    },
});

export const updateLinkQuery = extendType({  // 2
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateLink", {   // 3
            type: "Link",
            args: {   // 3
                id: nonNull(intArg()),
                url: nonNull(stringArg()),
                description: nonNull(stringArg())
            },
            resolve(parent, args, context, info) {    // 4
                const { description, url, id } = args; 

                const updateLink = context.prisma.link.update({
                    where: {
                      id: id,
                    },
                    data: {
                     description: description,
                     url: url
                    },
                  })
                return updateLink

            },
        });
    },
});

export const LinkMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Link",
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                const { description, url } = args;
                const { userId } = context;


                if (!userId) {
                    throw new Error("Cannot post without logging in.");
                }

                const newLink = context.prisma.link.create({
                    data: {
                        description: description,
                        url: url,
                       },
                });

                return newLink;
            },
        });
    },
});