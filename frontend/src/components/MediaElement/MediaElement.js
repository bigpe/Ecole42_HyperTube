import React, { useEffect, useState} from 'react';
import flvjs from 'flv.js';
import hlsjs from 'hls.js';
import 'mediaelement';

// Import stylesheet and shims
import 'mediaelement/build/mediaelementplayer.min.css';
import 'mediaelement/build/mediaelement-flash-video.swf';

const MediaElement = ({id, sources, tracks, options, width, height, preload, controls, poster, onErr}) => {
    const [player, setPlayer] = useState(null);

    window.flvjs = flvjs;
    window.Hls = hlsjs;
    useEffect(()=> {
        const { MediaElementPlayer } = global;
        const options = {
            ...options,
            pluginPath: './static/media/',
            success: (media, node, instance) => {
                onErr("success");

            },
            error: (media, node) => {
                onErr("error");
            }
        };
        setPlayer(new MediaElementPlayer(id, options));
        return () => {
            setPlayer(null);
        }
    },[]);

    return (
        <div>
            <video
                id={id}
                width={width}
                height={height}
                preload={preload}
                controls={controls}
                poster={poster}
            >
                {/*{tracks?.length && tracks?.map(track => (<track src={track.src} kind={track.kind} lang={track.lang} label={track.label}/>))}*/}
                {sources?.length && sources?.map(source => (<source src={source.src} type={source.type} />))}
            </video>
    </div>
    );
};

export default MediaElement;