import { redirect } from "@remix-run/node";
import supabase from "~/utils/supabase";

export const action = async ({ request }) => {
  const form = await request.formData();
  const actionName = form.get("actionName");
  const track = form.get("track");
  const parsedTrack = JSON.parse(track);

  console.log(actionName);

  switch (actionName) {
    case "changeVolume":
      const volume = form.get("volume");
      await supabase.from("tracks").upsert({
        id: parsedTrack.id,
        ...parsedTrack,
        volume,
      });
      break;

    case "changePan":
      const pan = form.get("pan");
      console.log("PAN: ", pan);
      await supabase.from("tracks").upsert({
        id: parsedTrack.id,
        ...parsedTrack,
        pan,
      });
      break;

    case "changeMute":
      const mute = form.get("mute");
      await supabase.from("tracks").upsert({
        id: parsedTrack.id,
        ...parsedTrack,
        mute,
      });
      break;

    case "changeSolo":
      const solo = form.get("solo");
      await supabase.from("tracks").upsert({
        id: parsedTrack.id,
        ...parsedTrack,
        solo,
      });
      break;

    case "changeHighEqLevel":
      const highEqLevel = form.get("highEqLevel");
      await supabase.from("tracks").upsert({
        id: parsedTrack.id,
        ...parsedTrack,
        highEqLevel: parseFloat(highEqLevel),
      });
      break;

    case "changeMidEqLevel":
      const midEqLevel = form.get("midEqLevel");
      await supabase.from("tracks").upsert({
        id: parsedTrack.id,
        ...parsedTrack,
        midEqLevel: parseFloat(midEqLevel),
      });
      break;

    case "changeLowEqLevel":
      const lowEqLevel = form.get("lowEqLevel");
      await supabase.from("tracks").upsert({
        id: parsedTrack.id,
        ...parsedTrack,
        lowEqLevel: parseFloat(lowEqLevel),
      });
      break;

    default:
      throw new Response(`Unknown action ${actionName}`, { status: 400 });
  }
  return redirect("/");
};
