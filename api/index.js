import {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} from "discord-interactions";
import getRawBody from "raw-body";
import { PostHog } from "posthog-node";

const hog = new PostHog('phc_m7aexycOjWFEvbQSRbTDTTYvJp5zEyjCPmCyedoWAG5', {
    host: "https://app.posthog.com",
});

/**
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */
export default async (request, response) => {
    if (request.method === "POST") {
        // Verify the request
        const signature = request.headers["x-signature-ed25519"];
        const timestamp = request.headers["x-signature-timestamp"];
        const rawBody = await getRawBody(request);

        const isValidRequest = verifyKey(
            rawBody,
            signature,
            timestamp,
            process.env.PUBLIC_KEY
        );

        if (!isValidRequest) {
            console.error("Invalid Request");
            return response.status(401).send({ error: "Bad request signature " });
        }

        // Handle the request
        const message = request.body;

        // Handle PINGs from Discord
        if (message.type === InteractionType.PING) {
            console.log("Handling Ping request");
            response.send({
                type: InteractionResponseType.PONG,
            });
        } else if (message.type === InteractionType.APPLICATION_COMMAND) {
            // Handle our Slash Commands
            switch (message.data.name.toLowerCase()) {
                case "quack":
                    console.log(message);
                    hog.capture({
                        distinctId: message.user?.id ?? message.member?.user?.id ?? "0",
                        event: "duck-sent",
                    });
                    let duckData = {};
                    await fetch("https://random-d.uk/api/v2/random")
                        .then((response) => response.json())
                        .then((data) => (duckData = data));
                    response.status(200).send({
                        type: 4,
                        data: {
                            embeds: [
                                {
                                    image: {
                                        url: duckData.url,
                                    },
                                    color: 16766977,
                                },
                            ],
                        },
                    });

                    break;
                default:
                    console.error("Unknown Command");
                    response.status(400).send({ error: "Unknown Type" });
                    break;
            }
        } else {
            console.error("Unknown Type");
            response.status(400).send({ error: "Unknown Type" });
        }
    }
};
