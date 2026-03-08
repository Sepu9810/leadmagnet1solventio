import {
    convexAuthNextjsMiddleware,
} from "@convex-dev/auth/nextjs/server";

export default convexAuthNextjsMiddleware(undefined, {
    apiRoute: "/api/login"
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (browser icon)
         * - public assets
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ]
};
