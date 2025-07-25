// List of domains
// Would of preferred to use JSON, but CF doesn't allow `require("fs")`
const domains = [
	"apis",
	"assetdelivery",
	"avatar",
	"badges",
	"catalog",
	"chat",
	"contacts",
	"contentstore",
	"develop",
	"economy",
	"economycreatorstats",
	"followings",
	"friends",
	"games",
	"groups",
	"groupsmoderation",
	"inventory",
	"itemconfiguration",
	"locale",
	"notifications",
	"points",
	"presence",
	"privatemessages",
	"publish",
	"search",
	"thumbnails",
	"trades",
	"translations",
	"users"
]

var repo_default = {
	async fetch(request) {
		const url = new URL(request.url);
		const path = url.pathname.split(/\//);
		const legacy = path[1] == "legacy"

		// Syntax checks
		if (legacy) {
			if (!path[2].trim()) 
				return new Response(JSON.stringify({ message: "Missing ROBLOX subdomain." }), { status: 400 });
			
			if (!domains.includes(path[2])) 
				return new Response(JSON.stringify({ message: "Specified subdomain is not allowed." }), { status: 401 });
		} else {
			if (!path[1].trim())
				return new Response(JSON.stringify({ message: "Missing path." }), { status: 400 })
		}

		const headers = new Headers(request.headers);
		headers.delete("host");
		headers.delete("roblox-id");
		headers.delete("user-agent");
		headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36";
		
		const init = {
			method: request.method,
			headers
		};

		if (request.method !== "GET" && request.method !== "HEAD") {
			init.body = await request.text();
		}
		
		return fetch(`https://${legacy ? path[2] : "apis"}.roblox.com/${path.slice(legacy ? 3 : 1).join("/")}${url.search}`, init);
	}
};

export {
	repo_default as default
};
