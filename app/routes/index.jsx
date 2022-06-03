import { useState, useEffect } from "react";
import { Form, useFetcher } from "@remix-run/react";
// import supabase from "~/utils/supabase";
import Mixer from "~/components/Mixer";

export default function Index() {
  const fetcher = useFetcher();
  const songQuery = fetcher.data;
  const [selectedSongId, setSelectedSongId] = useState("roxanne");

  // load server data via resource route based on selected song id
  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(`/songs/${selectedSongId}`);
    }
  }, [fetcher, selectedSongId]);

  useEffect(() => {
    fetcher.load(`/songs/${selectedSongId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSongId]);

  // useEffect(() => {
  //   supabase
  //     .from(`tracks:song_id=eq.${selectedSongId}`)
  //     .on("*", (payload) => {
  //       console.log("payload", payload.new.volume);
  //       setVolume(payload.new.volume);
  //     })
  //     .subscribe();
  // }, [selectedSongId]);

  function changeSong(e) {
    switch (e.target.value) {
      case "a-day-in-the-life":
        setSelectedSongId("a-day-in-the-life");
        break;

      case "roxanne":
        setSelectedSongId("roxanne");
        break;

      default:
        break;
    }
  }
  return (
    <div>
      {songQuery !== undefined && <Mixer song={songQuery.song} />}
      <Form method="post" style={{ display: "flex", justifyContent: "center" }}>
        <select
          onChange={changeSong}
          className="song-select"
          name="slug"
          id="song-select"
        >
          <option value="">Choose A Song...</option>
          <option value="a-day-in-the-life">
            The Beatles - A Day In The Life
          </option>
          <option value="roxanne">The Police - Roxanne</option>
        </select>
      </Form>
    </div>
  );
}
