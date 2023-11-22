import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import type { VideoType } from '../../types/Video'
import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import Video from './Video'

type ApiResponseType = {
  items: VideoType[]
}

const VideoListStyled = styled.div`
  display: grid;
  place-items: center;
  min-height: 100vh;
  .video-list {
    display: grid;
    place-items: center;
    gap: 1rem;
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    max-height: calc(100vh + 1rem);
    @media (min-width: 768px) {
      & {
        gap: 2rem;
      }
    }
    & > div:first-child {
      margin-top: 1rem;
    }
    & .video {
      scroll-snap-align: center;
    }
  }
`

export default function VideoList() {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [mute, setMute] = useState<boolean>(true)


  const getVideos = async () => {
    try {
      const res: AxiosResponse<ApiResponseType> = await axios.get(
        'http://localhost:8088/for_you_list'
      )
      setVideos(res.data.items)
    } catch (err: unknown) {
      console.log(err)
      toast.error('Something went wrong!')
    }
  }

  useEffect(() => {
    getVideos()
  }, [])

  return (
    <VideoListStyled className="container">
        {videos.map((video) => (
          <Video key={video.title} video={video} mute={mute} setMute={setMute} />
        ))}
    </VideoListStyled>
  )
}
