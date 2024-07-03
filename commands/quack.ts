import type { VercelResponse } from "@vercel/node";
import duckResponse from "../utils/duck";
import { hog } from "../api";

const quackCommand = async (message: any, response: VercelResponse) => {
  hog.capture({
    distinctId: message.user?.id ?? message.member?.user?.id ?? "0",
    event: "duck-sent",
  });
  let duckData = {};
  // await fetch("https://random-d.uk/api/v2/random")
  //   .then((response) => response.json())
  //   .then((data) => (duckData = data));
//   const theDuck = duckResponse.parse(duckData);
//   response.status(200).send({
//     type: 4,
//     data: {
//       embeds: [
//         {
//           image: {
//             url: theDuck.url,
//           },
//           color: 16766977,
//         },
//       ],
//     },
//   });
   response.status(200).send({
    type: 4,
    data: {
      embeds: [
        {
          title: "ducks are temporarially unavailable",
          description:
            "We're working on it, sorry! Join the Discord to be notified when ducks are back.",
          color: 16766977,
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Duckers Support server",
              style: 5,
              url: "https://discord.gg/XSS5h53mXg",
            },
          ],
        },
      ],
    },
  });
};
};

export default quackCommand;
