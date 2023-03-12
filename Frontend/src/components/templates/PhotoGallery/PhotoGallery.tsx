import { LightgalleryItem } from "react-lightgallery";

export default function PhotoGallery({ image, group }: any) {
  return (
    <LightgalleryItem group={group} src={image}>
      <img src={image} style={{ width: "100%" }} alt={image} />
    </LightgalleryItem>
  );
}
