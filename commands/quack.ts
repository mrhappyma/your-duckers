import type { VercelResponse } from "@vercel/node";
import duckResponse from "../utils/duck";
import { hog } from "../api";

const quackCommand = async (message: any, response: VercelResponse) => {
  hog.capture({
    distinctId: message.user?.id ?? message.member?.user?.id ?? "0",
    event: "duck-sent",
  });
  let duckData = {};
  await fetch("https://random-d.uk/api/v2/random")
    .then((response) => response.json())
    .then((data) => (duckData = data));
  const theDuck = duckResponse.parse(duckData);
  response.status(200).send({
    type: 4,
    data: {
      embeds: [
        {
          image: {
            url: theDuck.url,
          },
          color: 16766977,
        },
      ],
    },
  });
};

export default quackCommand;
