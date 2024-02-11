import { Ai } from './vendor/@cloudflare/ai.js';

const assistantPrompt = (identText: string) => `\
You are a linguistics expert and you have been asked to identify the language of the following text.\
Identify the language of the following text: ${identText}. \
Convert the language name to ISO 2 standard. \
Respond in the following format: { "language": <ISO 2 standard name> } . Say absolutely nothing else. \
`;

interface IdentificationInfo {
	text: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	
		if (request.method !== 'POST') {
			return Response.json({ error: `invalid request type, received ${request.method}!` }, { status: 400 });
		}

		const cType = request.headers.get('content-type');
		if (cType !== 'application/json') {
			return Response.json({ error: `invalid content-type, received ${cType}!` }, { status: 400 });
		}

		const test = await request.json<IdentificationInfo>();

		// ensure the test is valid

		if (!test.text) {
			return Response.json({ error: `missing required fields!` }, { status: 400 });
		}

		const prompt = assistantPrompt(test.text);


        const ai = new Ai(env.AI);

		// messages - chat style input
		const chat = { prompt };
		const response: {response: string} = await ai.run('@cf/meta/llama-2-7b-chat-int8', chat);
	
        // ensure the response is valid

        if (!response.response) {
            return Response.json({ error: `invalid response from AI!` }, { status: 400 });
        }


		return Response.json(response);
	},
};
