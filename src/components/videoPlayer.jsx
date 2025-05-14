"use client";

import React from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import "@/app/globals.css";

export default function VideoPlayer({ videoId }) {
    return (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
            <Plyr
                source={{
                    type: "video",
                    sources: [
                        {
                            src: videoId,
                            provider: "youtube",
                        },
                    ],
                }}
                options={{
                    youtube: {
                        controls: 0,
                        rel: 0,
                        modestbranding: 1,
                        showinfo: 0,
                    },
                    controls: [
                        "play",
                        "pause",
                        "progress",
                        "current-time",
                        "mute",
                        "volume",
                        "speed",
                        "settings",
                    ],
                    speed: {
                        selected: 1,
                        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75],
                    },
                }}
            />
        </div>
    );
}

