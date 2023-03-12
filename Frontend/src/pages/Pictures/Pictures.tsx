import { useEffect } from "react";
import ViewIcon from "assets/View.png";
import DeleteIcon from "assets/Delete.png";
import BgIcon from "assets/Background.png";
import AuthService from "services/auth.service";
import { useLightgallery } from "react-lightgallery";
import PictureService from "services/picture.service";
import { pictureActions } from "redux/slices/picture";
import { Grid, MenuItem, Select } from "@mui/material";
import InputName from "components/templates/InputName";
import { backgroundActions } from "redux/slices/background";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import PhotoGallery from "components/templates/PhotoGallery";
import ImageService from "services/image.service";
import SelectType from "components/templates/SelectType";
import { tabActions } from "redux/slices/tab";
import UploadBox from "pages/UploadBox";
import { useLocation } from "react-router-dom";

export default function Pictures() {
  const dispatch = useAppDispatch();
  const { openGallery } = useLightgallery();
  const { user } = useAppSelector((state) => state.auth);
  const { tab, upload } = useAppSelector((state) => state.tab);
  const location = useLocation();
  const { background, property } = useAppSelector((state) => state.background);
  const { pictures, type } = useAppSelector((state) => state.picture);

  useEffect(() => {
    PictureService.getPictures(dispatch);
  }, [dispatch]);

  const setBg = (image: any, id: any) => {
    let size = "";

    if (property === "") size = "normal";
    else if (property === "normal") size = "stretched";
    else if (property === "stretched") size = "repeat";
    else if (property === "repeat") size = "";
    else size = "";

    if (background !== "" && background !== image) size = "normal";

    let data = {
      background: size !== "" ? image : "",
      property: size,
      id,
    };
    dispatch(backgroundActions.setBackground(size !== "" ? image : ""));
    dispatch(backgroundActions.setProperty(size));
    dispatch?.(backgroundActions.setVideo(""));
    if (user) AuthService.background(data, dispatch);
    else ImageService.background(data, dispatch);
  };

  return (
    <>
      <div style={{ padding: "0 24px" }}>
        <SelectType />
      </div>
      {/* {loading ? (
        <SkeletonLoader />
      ) : ( */}
      <div className="basic-box">
        {upload ? (
          <UploadBox />
        ) : (
          <Grid container columnSpacing={3}>
            {pictures.map((picture: any, index: any) =>
              picture.type === type ? (
                type === "private" ? (
                  user ? (
                    picture?.user_id ===
                    (location.pathname.includes("profile")
                      ? location.pathname.split("/").pop()
                      : user?._id) ? (
                      <Grid item md={6} key={picture._id}>
                        <div className="content-item">
                          <InputName
                            id={picture._id}
                            name={picture.name}
                            type={tab}
                          />
                          <div className="items-box">
                            <PhotoGallery
                              group="picture_private"
                              image={`${process.env.REACT_APP_FILE_URL}/${picture.url}`}
                            ></PhotoGallery>
                          </div>
                          <p className="content-icons">
                            {location.pathname.includes("profile") ? (
                              ""
                            ) : (
                              <>
                                <img
                                  src={ViewIcon}
                                  alt="View"
                                  onClick={() => openGallery("picture_private")}
                                />
                                &nbsp;&nbsp;&nbsp;{" "}
                                <img
                                  src={BgIcon}
                                  alt="BG"
                                  onClick={() =>
                                    setBg(picture.url, picture._id)
                                  }
                                />
                                &nbsp;&nbsp;&nbsp;
                                <img
                                  src={DeleteIcon}
                                  alt="Delete"
                                  onClick={() =>
                                    PictureService.deletePicture(
                                      picture._id,
                                      dispatch
                                    )
                                  }
                                />
                              </>
                            )}
                          </p>
                        </div>
                      </Grid>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )
                ) : (
                  <Grid item md={6} key={picture._id}>
                    <div className="content-item">
                      <InputName
                        id={picture._id}
                        name={picture.name}
                        type={tab}
                      />
                      <div className="items-box">
                        <PhotoGallery
                          group="picture_private"
                          image={`${process.env.REACT_APP_FILE_URL}/${picture.url}`}
                        ></PhotoGallery>
                      </div>
                      <p className="content-icons">
                        <img
                          src={ViewIcon}
                          alt="View"
                          onClick={() => openGallery("picture_private")}
                        />
                        &nbsp;&nbsp;&nbsp;{" "}
                        <img
                          src={BgIcon}
                          alt="BG"
                          onClick={() => setBg(picture.url, picture._id)}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <img
                          src={DeleteIcon}
                          alt="Delete"
                          onClick={() =>
                            PictureService.deletePicture(picture._id, dispatch)
                          }
                        />
                      </p>
                    </div>
                  </Grid>
                )
              ) : (
                ""
              )
            )}
          </Grid>
        )}
      </div>
      {/* )} */}
    </>
  );
}
