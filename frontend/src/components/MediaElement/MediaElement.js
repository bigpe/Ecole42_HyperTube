import React, {Component, useEffect, useState} from 'react';
import flvjs from 'flv.js';
import hlsjs from 'hls.js';
import 'mediaelement';

// Import stylesheet and shims
import 'mediaelement/build/mediaelementplayer.min.css';
import 'mediaelement/build/mediaelement-flash-video.swf';

const MediaElement = (props) => {
    const [player, setPlayer] = useState(null);
    const
        sources = JSON.parse(props.sources),
        tracks = JSON.parse(props.tracks),
        success = (media, node, instance) => {},
        error = (media) => {props.onErr("error")}
    ;
    const tracksTags = tracks.length && tracks?.map(track => (`<track src="${track.src}" kind="${track.kind}" srclang="${track.lang}"${(track.label ? ` label=${track.label}` : '')}>`))
    const sourceTags = sources.length && sources?.map(source => (`<source src="${source.src}" type="${source.type}">`))
    window.flvjs = flvjs;
    window.Hls = hlsjs;
    const mediaBody = `${sourceTags?.join("\n")}${tracksTags?.join("\n")}`;
    const mediaHtml = `<video id="${props.id}" width="${props.width}" height="${props.height}"${(props.poster ? ` poster=${props.poster}` : '')}
					${(props.controls ? ' controls' : '')}${(props.preload ? ` preload="${props.preload}"` : '')}>
					${mediaBody}
				</video>`;


    useEffect(()=> {
        const { MediaElementPlayer } = global;
        const options = Object.assign({}, JSON.parse(props.options), {
            pluginPath: './static/media/',
            success: (media, node, instance) => success(media, node, instance),
            error: (media, node) => error(media, node)
        });
        setPlayer(new MediaElementPlayer(props.id, options));
    }, [props.id]);
    return (<div dangerouslySetInnerHTML={{__html: mediaHtml}}></div>);
};

export default MediaElement;

// export default class MediaElement extends Component {
//     state = {}
//
//     success(media, node, instance) {
//         this.props.onErr("success")
//     }
//
//     error(media) {
//         this.props.onErr("error")
//     }
//
//     render() {
//         const
//             props = this.props,
//             sources = JSON.parse(props.sources),
//             tracks = JSON.parse(props.tracks),
//             sourceTags = [],
//             tracksTags = []
//         ;
//
//         for (let i = 0, total = sources.length; i < total; i++) {
//             const source = sources[i];
//             sourceTags.push(`<source src="${source.src}" type="${source.type}">`);
//         }
//
//         for (let i = 0, total = tracks.length; i < total; i++) {
//             const track = tracks[i];
//             tracksTags.push();
//         }
//         const
//             mediaBody = `${sourceTags.join("\n")}
// 				${tracksTags.join("\n")}`,
//             mediaHtml = props.mediaType === 'video' ?
//                 `<video id="${props.id}" width="${props.width}" height="${props.height}"${(props.poster ? ` poster=${props.poster}` : '')}
// 					${(props.controls ? ' controls' : '')}${(props.preload ? ` preload="${props.preload}"` : '')}>
// 					${mediaBody}
// 				</video>` :
//                 `<audio id="${props.id}" width="${props.width}" controls>
// 					${mediaBody}
// 				</audio>`
//         ;
//         return (<div dangerouslySetInnerHTML={{__html: mediaHtml}}></div>);
//
//     }
//
//     componentDidMount() {
//         const { MediaElementPlayer } = global;
//
//         if (!MediaElementPlayer) return ;
//
//         const options = Object.assign({}, JSON.parse(this.props.options), {
//             pluginPath: './static/media/',
//             success: (media, node, instance) => this.success(media, node, instance),
//             error: (media, node) => this.error(media, node)
//         });
//
//         window.flvjs = flvjs;
//         window.Hls = hlsjs;
//         this.setState({player: new MediaElementPlayer(this.props.id, options)});
//     }
//
//     componentWillUnmount() {
//         if (this.state.player) {
//             this.state.player?.remove();
//             this.setState({player: null});
//         }
//     }
// }