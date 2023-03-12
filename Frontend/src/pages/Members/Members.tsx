import TigerImg from "assets/Tiger.png";
import PhotoGallery from "components/templates/PhotoGallery";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { backgroundActions } from "redux/slices/background";
import { tabActions } from "redux/slices/tab";
import UsersService from "services/users.service";

export default function Members() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.user.users);
  useEffect(() => {
    UsersService.getUsers();
  }, []);

  return (
    <div>
      <ul className="members-list">
        {users.map((user: any, index: number) => (
          <li
            className={user?.role === "admin" ? "admin-member" : ""}
            key={index}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="profile-image-list">
                <PhotoGallery
                  group="user"
                  image={
                    user?.profile_picture
                      ? `${process.env.REACT_APP_FILE_URL}/${user?.profile_picture}`
                      : TigerImg
                  }
                ></PhotoGallery>
              </div>
              {/* <img
                src={
                  user?.profile_picture
                    ? `${process.env.REACT_APP_FILE_URL}/${user?.profile_picture}`
                    : TigerImg
                }
                alt="User"
              /> */}
              <p style={{ textTransform: "capitalize" }}>{user.name}</p>
            </div>
            <Link
              to={`/profile/${user._id}`}
              onClick={() => {
                dispatch(tabActions.setTab("user"));
                dispatch(backgroundActions.setBgType("private"));
              }}
              style={{
                color: "#ffffff",
                textTransform: "capitalize",
                textDecoration: "none",
                fontSize: "16px",
                fontFamily: "'Varela Round', sans-serif",
              }}
            >
              {user.race}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
