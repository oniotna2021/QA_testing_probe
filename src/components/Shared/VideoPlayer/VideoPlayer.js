import React from 'react'

const VideoPlayer = ({ src }) => {
    return (
        <div className="d-flex justify-content-center embed-responsive embed-responsive-4by3" style={{ height: 400 }}>
            <video autoPlay={true} controls={true} preload="auto">
                <source src={src} />
            </video>
        </div>
    )
}

export default VideoPlayer
