/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import assistant from './assistant';
import langIdent from './langIdent';
import textToImg from './textToImg';
import translate from './translate';

// Export a default object containing event handlers
export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
		const url = new URL(request.url);

		// You can get pretty far with simple logic like if/switch-statements
		switch (url.pathname) {
			case '/translate':
				return translate.fetch(request, env, ctx);

			case '/lang_ident':
				return langIdent.fetch(request, env, ctx);

			case '/assistant':
				return assistant.fetch(request, env, ctx);

			case '/text_to_img':
				return textToImg.fetch(request, env, ctx);
		}

		return new Response(
			`Try making requests to:
      		<ul>
			<li><a href="/translate">/translate</a></li>
			<li><a href="/lang_ident">/lang_ident</a></li>
			<li><a href="/assistant">/assistant</a></li>
			<li><a href="/text_to_img">/text_to_img</a></li>
			<ul>`,	
			{ headers: { 'Content-Type': 'text/html' } }
		);
	},
};
