import FileDropZone from "components/atoms/FileDropZone";
import { useAppSelector } from "redux/hooks";

export default function UploadBox() {
  const tab = useAppSelector((state) => state.tab.tab);

  return (
    <div className="upload-box">
      <FileDropZone uploadType={tab} />
    </div>
  );
}
