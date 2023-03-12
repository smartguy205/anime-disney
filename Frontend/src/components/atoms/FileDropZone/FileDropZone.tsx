import "react-dropzone-uploader/dist/styles.css";
import Dropzone, {
  IDropzoneProps,
  IFileWithMeta,
  ILayoutProps,
} from "react-dropzone-uploader";
import UploadIcon from "assets/Upload.png";
import { config } from "config";
import ToasterService from "utils/toaster.util";
import GifService from "services/gif.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import PictureService from "services/picture.service";
import VideoService from "services/video.service";
import MusicService from "services/music.service";
import { tabActions } from "redux/slices/tab";
import AuthService from "services/auth.service";

const Layout = ({
  input,
  previews,
  submitButton,
  dropzoneProps,
  files,
  extra: { maxFiles },
}: ILayoutProps) => {
  return (
    <div className="dropzone-flex">
      <div {...dropzoneProps} style={{ color: "white !important" }}>
        {previews}
        <div style={{ display: "flex", alignItems: "center" }}>
          {files.length < maxFiles && input}
          &nbsp;&nbsp;&nbsp;
          {files.length > 0 && submitButton}
        </div>
      </div>
      {/* <div>{files.length > 0 && submitButton}</div> */}
    </div>
  );
};

export default function FileDropZone({ type, uploadType }: any) {
  const dispatch = useAppDispatch();
  const { type: gifType } = useAppSelector((state) => state.gif);
  const { type: videoType } = useAppSelector((state) => state.video);
  const { type: musicType } = useAppSelector((state) => state.music);
  const { type: pictureType } = useAppSelector((state) => state.picture);
  const { tab } = useAppSelector((state) => state.tab);

  const getUploadParams = async ({ file }: IFileWithMeta) => {
    const body = new FormData();
    body.append("image", file);
    return { url: `${config.API_URL}/guest/upload`, body };
  };

  const handleChangeStatus = ({ meta }: any, status: any) => {
    if (status === "headers_received") {
      ToasterService.showSuccess(`${meta.name} uploaded`);
    } else if (status === "aborted") {
      ToasterService.showError(`${meta.name} upload failed`);
    }
  };

  const handleSubmit: IDropzoneProps["onSubmit"] = (allFiles) => {
    let arr: any[] = [];
    allFiles.forEach((f) => {
      let payload = {} as any;
      const filename = f.meta.name.split(".").slice(0, -1).join(".");
      payload.name = filename;
      if (uploadType === "gifs") payload.type = gifType;
      if (uploadType === "music") payload.type = musicType;
      if (uploadType === "videos") payload.type = videoType;
      if (uploadType === "pictures") payload.type = pictureType;
      payload.file_type = f.meta.type;
      let xhr = JSON.parse(f?.xhr?.response);
      payload.url = xhr.data.url;
      arr.push({ ...payload });
    });

    if (uploadType === "gifs") GifService.addGif(arr, dispatch);
    if (uploadType === "music") MusicService.addMusic(arr, dispatch);
    if (uploadType === "videos") VideoService.addVideo(arr, dispatch);
    if (uploadType === "pictures") PictureService.addPicture(arr, dispatch);
    if (tab === "user") AuthService.profilePicture(arr[0], dispatch);

    allFiles.forEach((f) => f.remove());

    dispatch(tabActions.setUpload(false));
  };

  return (
    <Dropzone
      LayoutComponent={Layout}
      getUploadParams={getUploadParams}
      onSubmit={handleSubmit}
      onChangeStatus={handleChangeStatus}
      submitButtonContent={`Submit ${uploadType}`}
      maxFiles={tab === "user" ? 1 : 30}
      accept={
        uploadType === "videos"
          ? "video/*"
          : uploadType === "music"
          ? "audio/*"
          : uploadType === "gifs"
          ? ".gif"
          : uploadType === "pictures"
          ? ".png, .jpeg, .jpg, .webp, .png, .svg"
          : ""
      }
      inputContent={
        <div style={{ textAlign: "center" }}>
          {/* <img
            src={UploadIcon}
            alt="Upload"
            style={{
              width: "48px",
              margin: "0",
            }}
          /> */}
          <p
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "normal",
              textTransform: "capitalize",
            }}>
            {/* Drag and Drop or Browse to */}
            Upload&nbsp;
            {uploadType === "gifs"
              ? gifType
              : uploadType === "pictures"
              ? pictureType
              : uploadType === "music"
              ? musicType
              : uploadType === "videos"
              ? videoType
              : ""}
            &nbsp;
            {tab === "user" ? "Profile Picture" : uploadType}
          </p>
        </div>
      }
      styles={{
        dropzone: {
          minHeight: 100,
          maxHeight: 100,
          border: "none",
          borderRadius: 0,
          color: "white",
        },
      }}
    />
  );
}
