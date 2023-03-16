import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import SailorA from "assets/Sailor Moon 1.png";
import SailorB from "assets/Sailor Moon 2.png";
import SailorC from "assets/Sailor Moon 3.png";
import SailorD from "assets/Sailor Moon 4.png";
import Quinn1 from "assets/quinn.png";
import Quinn2 from "assets/quinn1.png";
import Quinn3 from "assets/quinn2.png";
import Quinn4 from "assets/quinn3.png";
import Quinn5 from "assets/quinn4.png";
import Quinn6 from "assets/quinn5.png";
import Quinn7 from "assets/quinn6.png";
import Quinn8 from "assets/quinn7.png";
import MusicDropZone from "components/atoms/MusicDropZone";
import ImageService from "services/image.service";
import AuthService from "services/auth.service";
import { backgroundActions } from "redux/slices/background";

export default function SailorMoon() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const visitedUser = useAppSelector((state) => state.user.user);
  const { music, outfit, anime, bgType } = useAppSelector(
    (state) => state.background
  );
  const [anim, setAnim] = useState(anime);
  const [image, setImage] = useState(true);
  const [character, setCharacter] = useState(1);
  const [quinn, setQuinn] = useState(0);
  const changeQuinn = () => {
    const new_quinn = quinn + 1;
    if (new_quinn > 3) {
      setQuinn(0);
    } else {
      setQuinn(new_quinn);
    }
  };

  const QuinnGroup = [
    { quinn1: Quinn1, quinn2: Quinn2 },
    { quinn1: Quinn3, quinn2: Quinn4 },
    { quinn1: Quinn5, quinn2: Quinn6 },
    { quinn1: Quinn7, quinn2: Quinn8 },
  ];
  const audioRef = useRef<any>();
  let sailorPlay = useRef<any>(null);

  useEffect(() => {
    setAnim(anime);
  }, [anime]);

  useEffect(() => {
    setImage(outfit);
  }, [outfit]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [user, music, visitedUser, bgType]);

  useEffect(() => {
    ImageService.getBgMusic(dispatch);
  }, []);

  const outfitChange = () => {
    setImage(!image);

    if (user) AuthService.outfit(image, dispatch);
    else ImageService.outfit(image, dispatch);
  };
  const CharacterShowSailor = () => {
    return (
      <>
        {music || user?.music ? (
          anim ? (
            <img
              alt="Sailor Music B"
              src={image ? SailorB : SailorD}
              onClick={() => outfitChange()}
            />
          ) : (
            <img
              alt="Sailor Music A"
              src={image ? SailorA : SailorC}
              onClick={() => outfitChange()}
            />
          )
        ) : (
          <img
            alt="Sailor A"
            src={image ? SailorA : SailorC}
            onClick={() => outfitChange()}
          />
        )}
      </>
    );
  };

  const CharacterShowQuinn = () => {
    return (
      <>
        {music || user?.music ? (
          anim ? (
            <img
              alt="Sailor Music B"
              height="336px"
              src={QuinnGroup[quinn].quinn2}
              onClick={() => changeQuinn()}
            />
          ) : (
            <img
              alt="Sailor Music A"
              height="336px"
              src={QuinnGroup[quinn].quinn1}
              onClick={() => changeQuinn()}
            />
          )
        ) : (
          <img
            alt="Sailor A"
            height="336px"
            src={QuinnGroup[quinn].quinn1}
            onClick={() => changeQuinn()}
          />
        )}
      </>
    );
  };
  const character1Style = character == 1 ? "white" : "black";
  const character2Style = character == 2 ? "white" : "black";
  return (
    <div className="sailor-img">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "80%",
          margin: "auto",
        }}>
        <h3
          style={{
            fontFamily: "'Varela Round', sans-serif",
            fontSize: "16px",
            cursor: "pointer",
            color: `${character1Style}`,
          }}
          onClick={() => setCharacter(1)}>
          Sailor Moon
        </h3>
        <h3
          style={{
            fontFamily: "'Varela Round', sans-serif",
            fontSize: "16px",
            cursor: "pointer",
            color: `${character2Style}`,
          }}
          onClick={() => setCharacter(2)}>
          Harley Quinn
        </h3>
      </div>
      {character == 1 && <CharacterShowSailor />}
      {character == 2 && <CharacterShowQuinn />}
      <audio
        controls
        autoPlay
        loop
        ref={audioRef}
        onPlay={() => {
          sailorPlay.current = setInterval(function () {
            setAnim((prev) => !prev);
          }, 300);
        }}
        onPause={() => {
          if (sailorPlay.current) clearInterval(sailorPlay.current);
        }}>
        <source
          src={
            visitedUser
              ? `${process.env.REACT_APP_FILE_URL}/${
                  bgType === "private" ? visitedUser?.music : music
                }`
              : user
              ? `${process.env.REACT_APP_FILE_URL}/${
                  bgType === "private" ? user?.music : music
                }`
              : `${process.env.REACT_APP_FILE_URL}/${music}`
          }
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
      <br />
      <>
        <button
          onClick={() => dispatch(backgroundActions.setBgType("public"))}
          style={{
            cursor: "pointer",
            border: 0,
            fontFamily: "'Varela Round', sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            background: "none",
            color: "white",
            padding: 0,
            marginBottom: "0.83em",
          }}>
          Public
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button
          onClick={() => {
            if (visitedUser || user)
              dispatch(backgroundActions.setBgType("private"));
          }}
          style={{
            cursor: "pointer",
            border: 0,
            fontFamily: "'Varela Round', sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            background: "none",
            color: visitedUser || user ? "white" : "black",
            padding: 0,
            marginBottom: "0.83em",
          }}>
          Private
        </button>
      </>
      <div className="music-upload-box">
        <MusicDropZone musicType={bgType} />
      </div>
    </div>
  );
}
