import { useRef, useState, useEffect } from 'react'
import { styled } from 'styled-components'
import { VideoType } from '../../types/Video'
import { IoMdPause, IoMdPlay, IoMdVolumeHigh, IoMdVolumeOff } from 'react-icons/io'
import Hls from 'hls.js'

const VideoStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  gap: 1rem;
  height: calc(100vh - 1rem);
  position: relative;
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 15rem;
  }
  input[type='range']::-webkit-slider-runnable-track {
    background: #053a5f;
    height: 0.5rem;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -1px; /* Centers thumb on the track */
    background-color: white;
    border-radius: 10%;
    width: 10px;
    height: 10px;
  }
  .video {
    height: 100%;
    aspect-ratio: 9 / 16;
    position: relative;
    border-radius: 1rem;
    max-width: calc(100vw - 2.5rem);
    overflow: hidden;
    .imgpost {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      z-index: 10;
    }
    .progressBar {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 9999;
    }
    video {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
    .video-actions {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      z-index: 30;
      button {
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(var(--light-color));
        transition: 0.15s;
        &:hover {
          background: rgb(var(--light-color) / 0.25);
        }
        svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
    .video-details {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0 3rem 1rem 1rem;
      background: linear-gradient(
        0deg,
        rgba(var(--dark-color) / 0.8) 0%,
        rgba(var(--dark-color) / 0) 100%
      );
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 0.75rem;
      p {
        font-size: 0.9rem;
        color: rgb(var(--light-color));
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .creator-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        img {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          object-fit: cover;
        }
        button {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          background: rgb(var(--primary-color));
        }
      }
    }
    .buttons {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 2rem 0.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      & > div {
        & span {
          display: block;
          font-size: 0.75rem;
          color: rgb(var(--light-color));
          text-align: center;
        }
        &.like {
          & button.liked {
            color: rgb(var(--like-color));
          }
        }
        &.dislike {
          & button.disliked {
            color: rgb(var(--primary-color));
          }
        }
      }
      button {
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(var(--light-color));
        transition: 0.15s;
        &:hover {
          background: rgb(var(--light-color) / 0.25);
        }
        svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }
`

const Video = ({
  video,
  mute,
  setMute,
  playingVideo,
  setPlayingVideo
}: {
  video: VideoType
  mute: boolean
  setMute: React.Dispatch<React.SetStateAction<boolean>>
  playingVideo: string | null
  setPlayingVideo: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [play, setPlay] = useState(video.title === playingVideo)
  const [videoTime, setVideoTime] = useState<number>(0)

  const updateTime = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.target as HTMLVideoElement
    if (videoElement.duration >= 0) {
      const time = (videoElement.currentTime / videoElement.duration) * 100
      setVideoTime(time)
    }
  }

  const progressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const value = +e.target.value
    const time = videoRef.current?.duration * (value / 100)
    setVideoTime(value)
    videoRef.current.currentTime = time
  }

  useEffect(() => {
    const currentVideoRef = videoRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target.id !== playingVideo &&
            (entry.target as HTMLVideoElement)?.paused
          ) {
            setPlay(true)
            setPlayingVideo(entry.target.id)
            return
          }
          if (!entry.isIntersecting) {
            setPlay(false)
            return
          }
        })
      },
      {
        threshold: 0.5
      }
    )
    if (currentVideoRef) {
      observer.observe(currentVideoRef)
    }
    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef)
      }
    }
  }, [playingVideo, setPlayingVideo])

  useEffect(() => {
    const hls = new Hls()
    const url = video.play_url

    if (play && videoRef.current) {
      // 如果當前時間大於 0 則不重新載入
      if (videoRef.current.currentTime > 0) {
        videoRef.current?.play()
        return
      }

      // init
      if (Hls.isSupported()) {
        hls.attachMedia(videoRef.current)
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(url)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play().catch(() => console.log('err'))
          })
        })
        // 若為 mobile 則直接播, 但目前只吃 https
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = video.play_url
        videoRef.current.play()
      }
      return
    }

    videoRef.current?.pause()

    return () => {
      if (hls != null) {
        hls.destroy()
      }
    }
  }, [play, video.play_url])

  return (
    <VideoStyled>
      <div className="video selected">
        <video
          ref={videoRef}
          poster={video.cover}
          id={video.title}
          autoFocus
          autoPlay={play}
          loop={video.title === playingVideo}
          onClick={(event) => {
            event.stopPropagation()
            setPlay(!play)
          }}
          onTimeUpdate={updateTime}
          muted={mute}
        />
        {/* 暫停遮罩 */}
        {!play && (
          <img
            src={video.cover}
            className="imgpost"
            alt="Poster"
            onClick={(event) => {
              event.stopPropagation()
              setPlay(true)
            }}
          />
        )}
        <div className="video-actions">
          <div className="play-pause">
            {play ? (
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  setPlay(false)
                }}
              >
                <IoMdPause />
              </button>
            ) : (
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  setPlay(true)
                }}
              >
                <IoMdPlay />
              </button>
            )}
          </div>
          <div className="volume">
            {mute ? (
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  setMute(false)
                }}
              >
                <IoMdVolumeOff />
              </button>
            ) : (
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  setMute(true)
                }}
              >
                <IoMdVolumeHigh />
              </button>
            )}
          </div>
        </div>
        <input
          type="range"
          id="progressBar"
          className="progressBar"
          min="0"
          max="100"
          value={videoTime}
          onChange={progressUpdate}
        ></input>
      </div>
    </VideoStyled>
  )
}

export default Video
