import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Stack, Box, Typography, CircularProgress } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

import { Videos } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFromAPI(
          `videos?part=snippet,statistics&id=${id}`
        );
        setVideoDetail(data.items[0]);

        const videos = await fetchFromAPI(
          `search?part=snippet&relatedToVideoId=${id}&type=video`
        );
        setVideos(videos.items);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box
        minHeight="95vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minHeight="95vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="white">
          An error occurred while fetching video details.
        </Typography>
      </Box>
    );
  }

  if (!videoDetail) {
    return (
      <Box
        minHeight="95vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="white">Video not found.</Typography>
      </Box>
    );
  }

  const {
    snippet: { publishedAt, title, channelId, channelTitle },
    statistics: { viewCount, likeCount },
  } = videoDetail;

  return (
    <Box minHeight="95vh">
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
      >
        <Box flex={1}>
          <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
            />
            <Box p={2}>
              <Typography
                color="#fff"
                variant="h5"
                fontWeight="bold"
              >
                {title}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ color: "#fff" }}
                py={1}
                px={2}
              >
                <Link to={`/channel/${channelId}`}>
                  <Typography
                    color="#fff"
                    variant={{ sm: "subtitle1", md: "h6" }}
                  >
                    {channelTitle}
                    <CheckCircle
                      sx={{ fontSize: 11, color: "gray", ml: "5px" }}
                    />
                  </Typography>
                </Link>
                <Stack
                  direction="row"
                  gap="20px"
                  alignItems="center"
                >
                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.7 }}
                  >
                    {parseInt(viewCount).toLocaleString()} Views
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.7 }}
                  >
                    {new Date(publishedAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.7 }}
                  >
                    {parseInt(likeCount).toLocaleString()} Likes
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>
        <Box
          px={2}
          py={{ md: 1, xs: 5 }}
          justifyContent="center"
          alignItems="center"
        >
          <Videos
            videos={videos}
            direction="column"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
