import Login from "pages/Login";
import { useState } from "react";
import Register from "pages/Register";
import { Grid } from "@mui/material";
import Recovery from "pages/Recovery";
import { useAppSelector } from "redux/hooks";
import Button from "components/atoms/Button";
import { useLocation } from "react-router-dom";
import UploadBox from "pages/UploadBox";
import PhotoGallery from "components/templates/PhotoGallery";

export default function User() {
  const [type, setType] = useState("login");
  const user = useAppSelector((state) => state.auth.user);
  const { upload } = useAppSelector((state) => state.tab);

  const { pathname } = useLocation();

  return (
    <div>
      {/* <h2 className="heading">User</h2> */}

      <div>
        <Grid container justifyContent={"center"}>
          <Grid item xs={12} md={6}>
            {!user && !pathname.includes("profile") ? (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "16px",
                  cursor: "pointer",
                }}
              >
                <Button
                  variant="text"
                  onClick={() => setType("login")}
                  sx={{ fontSize: "16px" }}
                >
                  Login
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                  variant="text"
                  onClick={() => setType("register")}
                  sx={{ fontSize: "16px" }}
                >
                  Register
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                  variant="text"
                  onClick={() => setType("recovery")}
                  sx={{ fontSize: "16px" }}
                >
                  Recovery
                </Button>
              </div>
            ) : (
              ""
            )}
            {pathname.includes("profile") ? (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "16px",
                  cursor: "pointer",
                }}
              ></div>
            ) : (
              ""
            )}
            <div>
              {upload ? (
                <>
                  <UploadBox />
                  {user.profile_picture ? (
                    <>
                      <br />
                      <br />
                      <PhotoGallery
                        group="user"
                        image={`${process.env.REACT_APP_FILE_URL}/${user.profile_picture}`}
                      ></PhotoGallery>
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : !user && !pathname.includes("profile") ? (
                type === "login" ? (
                  <Login />
                ) : type === "recovery" ? (
                  <Recovery />
                ) : (
                  <Register />
                )
              ) : (
                <Register />
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
