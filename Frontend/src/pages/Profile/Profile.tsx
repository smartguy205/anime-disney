import { Grid } from "@mui/material";
import Gifs from "pages/Gifs";
import Members from "pages/Members";
import Music from "pages/Music";
import Pictures from "pages/Pictures";
import SailorMoon from "pages/SailorMoon";
import User from "pages/User";
import Videos from "pages/Videos";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { tabActions } from "redux/slices/tab";
import { userActions } from "redux/slices/users";
import UsersService from "services/users.service";

export default function Profile() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { tab } = useAppSelector((state) => state.tab);

  useEffect(() => {
    dispatch(tabActions.setTab("user"));

    let pathArray = pathname.split("/");
    let userId = pathArray.pop();

    UsersService.getUser(userId);

    return () => {
      dispatch(userActions.setUser(null));
    };
  }, [pathname]);

  return (
    <div className="main">
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <div
            className="basic-box left-section"
            style={{
              height: "calc(100vh - 124px)",
            }}
          >
            <h2
              className="heading"
              onClick={() =>
                window.open(
                  "https://www.paypal.com/paypalme/DamianGower",
                  "_blank"
                )
              }
              style={{ cursor: "pointer" }}
            >
              Donate
            </h2>
            <SailorMoon />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div style={{ position: "relative" }}>
            <div className="center-box">
              {tab === "gifs" ? (
                <Gifs />
              ) : tab === "pictures" ? (
                <Pictures />
              ) : tab === "videos" ? (
                <Videos />
              ) : tab === "music" ? (
                <Music />
              ) : tab === "user" ? (
                <User />
              ) : (
                ""
              )}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={3}>
          <h2
            className="heading"
            style={{
              // marginTop: "2px",
              padding: "0 24px",
            }}
          >
            Online
          </h2>
          <div
            className="basic-box right-section"
            style={{ height: "calc( 100vh - 164px )" }}
          >
            <Members />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
