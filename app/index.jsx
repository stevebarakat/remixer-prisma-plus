import { useState, useEffect } from "react";
import { Form, useFetcher } from "@remix-run/react";
import Mixer from "~/components/Mixer";
import supabase from "~/utils/supabase";

export default function Index() {
  const fetcher = useFetcher();
  const [currentSong, setCurrentSong] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const handleSetIsLoaded = (value) => setIsLoaded(value);

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(`/songs/${currentSong}`);
    }
  }, [fetcher, currentSong]); // the data from the loader

  useEffect(() => {
    fetcher.load(`/songs/${currentSong}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   supabase.from(`tracks:song_id=eq.${currentSong.id}`);
  // }, [currentSong]);

  let docSnap = null;
  if (typeof fetcher.data !== "undefined") {
    docSnap = fetcher.data;
  }

  function changeSong(e) {
    switch (e.target.value) {
      case "a-day-in-the-life":
        setCurrentSong(1);
        break;

      case "roxanne":
        setCurrentSong(2);
        break;

      default:
        break;
    }
  }

  return (
    <div>
      {docSnap !== null && (
        <Mixer
          song={docSnap.song}
          isLoaded={isLoaded}
          handleSetIsLoaded={handleSetIsLoaded}
        />
      )}
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
        <button className="submit-btn">Load It!</button>
      </Form>
    </div>
  );
}
