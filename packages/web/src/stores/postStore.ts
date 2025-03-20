import { CredentialManager, XRPC } from "@atcute/client";
import type { AppBskyFeedDefs } from "@atcute/client/lexicons";
import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
	state: () => ({
		currentPost: null as AppBskyFeedDefs.PostView | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		async fetchPost(uri: string) {
			this.loading = true;
			this.error = null;

			try {
				const manager = new CredentialManager({
					service: "https://public.api.bsky.app",
				});
				const rpc = new XRPC({ handler: manager });
				const { data } = await rpc.get("app.bsky.feed.getPostThread", {
					params: { uri: uri, depth: 0 },
				});

				if (!data.thread) {
					this.error = "no thread found";
					this.currentPost = null;
					return;
				}

				if (data.thread.$type === "app.bsky.feed.defs#threadViewPost") {
					this.currentPost = data.thread.post;
				} else {
					this.error = "invalid thread type";
					this.currentPost = null;
				}
			} catch (e) {
				this.error = e instanceof Error ? e.message : "unknown error";
				this.currentPost = null;
			} finally {
				this.loading = false;
			}
		},

		clearPost() {
			this.currentPost = null;
			this.error = null;
		},
	},
});
