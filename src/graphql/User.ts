import { extendType, nonNull, objectType, stringArg, intArg, idArg } from "nexus"; 

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.list.nonNull.field("links", {    // 1
            type: "Link",
            resolve(parent, args, context) {   // 2
                return context.prisma.user  // 3
                    .findUnique({ where: { id: parent.id } })
                    .links();
            },
        }); 
        t.nonNull.list.nonNull.field("votes", {
            type: "Link",
            resolve(parent, args, context) {
                return context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .votes();
            }
        })
    },
});

export const UserQuery = extendType({  // 2
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("userFeed", {   // 3
            type: "User",
            resolve(parent, args, context, info) {    // 4
                return context.prisma.user.findMany();  // 1
            },
        });
    },
});