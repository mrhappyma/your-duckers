import type { VercelResponse } from "@vercel/node";

const infoCommand = async (response: VercelResponse) => {
  response.status(200).send({
    type: 4,
    data: {
      embeds: [
        {
          title: "Duckers",
          description:
            "Duckers is a Discord bot that sends ducks. It's that simple.",
          color: 16766977,
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Powered by random-d.uk",
              style: 5,
              url: "https://random-d.uk",
            },
            {
              type: 2,
              label: "Duckers is open-source",
              style: 5,
              url: "https://github.com/mrhappyma/duckers",
            },
          ],
        },
      ],
    },
  });
};

export default infoCommand;
