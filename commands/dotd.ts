import { hog } from "../api";
import type { VercelResponse } from "@vercel/node";

const dotdCommand = async (message: any, response: VercelResponse) => {
  const enabled = await hog.isFeatureEnabled(
    "duck_schedule",
    message.user?.id ?? message.member?.user?.id ?? "0"
  );
  if (enabled) {
  } else {
    response.status(200).send({
      type: 4,
      data: {
        flags: 64,
        content: "You do not have access to this feature.",
      },
    });
  }
};

export default dotdCommand;
