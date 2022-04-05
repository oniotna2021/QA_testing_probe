import React, { Profiler } from 'react'
import HoverVideoPlayer from 'react-hover-video-player';


const FramePreviewVideo = ({ videoSrc, thumbnailImageSrc }) => {
    const renderTiming = React.useRef();
    if (!renderTiming.current) {
        renderTiming.current = {
            averageRenderTime: 0,
            renderCount: 0,
        };
    }

    // Logs out helpful render timing info for performance measurements
    const onProfilerRender = React.useCallback(
        (
            id, // the "id" prop of the Profiler tree that has just committed
            phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
            actualDuration // time spent rendering the committed update
        ) => {
            if (phase === 'mount') {
               // console.log(`${videoSrc} | MOUNT: ${actualDuration}ms`);
            } else {
                renderTiming.current.renderCount += 1;
                renderTiming.current.averageRenderTime +=
                    (actualDuration - renderTiming.current.averageRenderTime) /
                    renderTiming.current.renderCount;
                /*console.log(
                    `${videoSrc} | UPDATE: ${actualDuration}ms | New average: ${renderTiming.current.averageRenderTime}ms`
                );*/
            }
        },
        [videoSrc]
    );

    return (
        <Profiler id={videoSrc} onRender={onProfilerRender}>
            {/* TEST COMPONENT HERE */}
            <HoverVideoPlayer
                videoSrc={videoSrc}
                videoStyle={{
                    width:'70px',
                    height: '70px',
                    borderRadius: 8,
                }}
                style={{
                    width:'70px',
                    height: '70px',
                    borderRadius: 8,
                }}
                pausedOverlay={
                    <img
                        src={thumbnailImageSrc}
                        alt=""
                        style={{
                            borderRadius: 8,
                            objectFit: 'cover',
                            width: '70px',
                            height: '70px',
                        }}
                    />
                }
                loadingOverlay={
                    <div className="loading-spinner-overlay" />
                }
                crossorigin="anonymous"
                unloadVideoOnPaused
                restartOnPaused
            />
        </Profiler>
    );
}

export default FramePreviewVideo