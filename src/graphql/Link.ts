import { extendType, nonNull, objectType, stringArg, intArg, idArg } from "nexus"; 
import { NexusGenObjects } from "../../nexus-typegen"; 

export const Link = objectType({
    name: "Link", // 1 
    definition(t) {  // 2
        t.nonNull.int("id"); // 3 
        t.nonNull.string("description"); // 4
        t.nonNull.string("url"); // 5 
    },
});

let links: NexusGenObjects["Link"][]= [   // 1
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
];

export const LinkQuery = extendType({  // 2
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   // 3
            type: "Link",
            resolve(parent, args, context, info) {    // 4
                return links;
            },
        });
    },
});

export const singleLinkQuery = extendType({  // 2
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("link", {   // 3
            type: "Link",
            args: {   // 3
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {    // 4
                const { id } = args; 
                let link = links.filter(l => l.id === id)
                return link;
            },
        });
    },
});

export const deleteLinkQuery = extendType({  // 2
    type: "Mutation",
    definition(t) {
        t.nonNull.list.nonNull.field("deleteLink", {   // 3
            type: "Link",
            args: {   // 3
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {    // 4
                const { id } = args; 
                let updatedLinks = links.filter(l => l.id !== id)
                links = updatedLinks
                return links;
            },
        });
    },
});

export const updateLinkQuery = extendType({  // 2
    type: "Mutation",
    definition(t) {
        t.nonNull.list.nonNull.field("updateLink", {   // 3
            type: "Link",
            args: {   // 3
                id: nonNull(intArg()),
                url: nonNull(stringArg()),
                description: nonNull(stringArg())
            },
            resolve(parent, args, context, info) {    // 4
                const { description, url, id } = args; 
                let updatedLinks = links.filter(l => l.id == id)
                updatedLinks[0].description = description
                updatedLinks[0].url = url

                links = updatedLinks
                return links;
            },
        });
    },
});

export const LinkMutation = extendType({  // 1
    type: "Mutation",    
    definition(t) {
        t.nonNull.field("post", {  // 2
            type: "Link",  
            args: {   // 3
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve(parent, args, context) {    
                const { description, url } = args;  // 4
                
                let idCount = links.length + 1;  // 5
                const link = {
                    id: idCount,
                    description: description,
                    url: url,
                };
                links.push(link);
                return link;
            },
        });
    },
});