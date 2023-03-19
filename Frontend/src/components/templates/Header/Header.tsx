import "./Header.css";
import { Grid } from "@mui/material";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { tabActions } from "redux/slices/tab";
import { useNavigate } from "react-router-dom";
import { messageActions } from "redux/slices/message";

export default function Header() {
  const message = useAppSelector((state) => state.message);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <header>
      <div className="navbar">
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} lg={6}>
            <ul>
              <li
                onClick={() => {
                  navigate("/");
                  dispatch(tabActions.setTab("chat"));
                  dispatch(messageActions.setPublic());
                }}>
                Chat
              </li>
              <li onClick={() => dispatch(tabActions.setTab("gifs"))}>Gifs</li>
              <li onClick={() => dispatch(tabActions.setTab("pictures"))}>
                Pictures
              </li>
              <li onClick={() => dispatch(tabActions.setTab("videos"))}>
                Videos
              </li>
              <li onClick={() => dispatch(tabActions.setTab("music"))}>
                Music
              </li>
              <li
                onClick={() => {
                  navigate("/");
                  dispatch(tabActions.setTab("user"));
                }}>
                User
              </li>
            </ul>
          </Grid>
        </Grid>
      </div>
    </header>
  );
}
