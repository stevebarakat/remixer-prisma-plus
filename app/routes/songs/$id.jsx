import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";

export const loader = async ({ params: { id } }) => {
  const song = await db.song.findUnique({
    where: { id: id },
    include: { tracks: true },
  });
  if (!song) throw new Error("Song not found");
  const data = { song };
  return json(data);
};
