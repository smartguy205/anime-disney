import "./App.css";

import { BrowserRouter, useLocation } from "react-router-dom";

import AppRoutes from "routes/AppRoutes";
import Toaster from "components/atoms/Toaster";
import Header from "components/templates/Header";
import AppModal from "components/templates/AppModal";
import RegisterAppDispatch from "components/atoms/RegisterAppDispatch";

import theme from "./theme";
import { useEffect } from "react";
import createCache from "@emotion/cache";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/lab";
import dateAdapter from "@mui/lab/AdapterDateFns";
import "lightgallery.js/dist/css/lightgallery.css";
import { ThemeProvider } from "@mui/material/styles";
import { LightgalleryProvider } from "react-lightgallery";
import { backgroundActions } from "redux/slices/background";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import ImageService from "services/image.service";
import SocketService from "services/socket.service";
import useEffectOnce from "hooks/useEffectOnce";

const cache = createCache({ key: "css", prepend: true });

export default function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const visitedUser = useAppSelector((state) => state.user.user);
  const { background, property, video } = useAppSelector(
    (state) => state.background
  );

  useEffect(() => {
    console.log("Hiiii", visitedUser?.background);

    if (visitedUser) {
      dispatch(backgroundActions.setBackground(visitedUser?.background));
      dispatch(backgroundActions.setProperty(visitedUser?.property));
      dispatch(backgroundActions.setVideo(visitedUser?.video));
    } else if (user) {
      dispatch(backgroundActions.setBackground(user?.background));
      dispatch(backgroundActions.setProperty(user?.property));
      dispatch(backgroundActions.setVideo(user?.video));
    } else {
      ImageService.getBackground(dispatch);
    }
  }, [dispatch, user, visitedUser]);

  useEffectOnce(() => {
    SocketService.join(user);
    SocketService.getCurrent();
  });

  useEffect(() => {
    SocketService.connections(dispatch);
  }, [dispatch]);

  return (
    <div
      style={{
        backgroundImage: `url("${process.env.REACT_APP_FILE_URL}/${
          visitedUser
            ? visitedUser?.background
            : user
            ? user?.background
            : background
        }")`,
        backgroundSize: `${
          property === "stretched"
            ? "100% 100%"
            : property === "repeat"
            ? "unset"
            : "contain"
        }`,
        backgroundPosition: `${property === "repeat" ? "unset" : "center"}`,
        backgroundRepeat: `${property === "repeat" ? "round" : "no-repeat"}`,
        height: "100vh",
      }}
    >
      {video && (
        <video
          loop
          autoPlay
          className={`${
            property === "normal" ? "bg-video-normal" : ""
          } bg-video`}
        >
          <source
            src={`${process.env.REACT_APP_FILE_URL}/${
              visitedUser ? visitedUser?.video : user ? user?.video : video
            }`}
            type="video/mp4"
          />
          <source
            src={`${process.env.REACT_APP_FILE_URL}/${
              visitedUser ? visitedUser?.video : user ? user?.video : video
            }`}
            type="video/ogg"
          />
        </video>
      )}
      <SnackbarProvider
        maxSnack={5}
        hideIconVariant
        preventDuplicate
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        iconVariant={{
          success: "✅",
          error: "✖️",
          warning: "⚠️",
          info: "ℹ️",
        }}
      >
        <Toaster />
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>
            <LightgalleryProvider>
              <LocalizationProvider dateAdapter={dateAdapter}>
                <CssBaseline />
                <RegisterAppDispatch />
                <BrowserRouter>
                  <Header />
                  <AppModal />
                  <AppRoutes />
                </BrowserRouter>
              </LocalizationProvider>
            </LightgalleryProvider>
          </ThemeProvider>
        </CacheProvider>
      </SnackbarProvider>
    </div>
  );
}
