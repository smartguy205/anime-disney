import { Grid } from "@mui/material";
import Chat from "pages/Chat";
import { useAppSelector } from "redux/hooks";
import Gifs from "pages/Gifs";
import Pictures from "pages/Pictures";
import Music from "pages/Music";
import Videos from "pages/Videos";
import User from "pages/User";
import Members from "pages/Members";
import SailorMoon from "pages/SailorMoon";
import ChatBox from "components/molecules/ChatBox";

export default function Home() {
  const { tab } = useAppSelector((state) => state.tab);

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
              {tab === "chat" ? (
                <Chat />
              ) : tab === "gifs" ? (
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
              {tab === "chat" ? (
                <ChatBox />
              ) : tab === "user" ? (
                ""
              ) : (
                ""
                // <UploadBox />
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
