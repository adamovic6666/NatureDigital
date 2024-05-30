import {
  NOTIFICATION_MESSAGES,
  REQUEST_SECRET,
  TEXTS,
  URL_KEYS,
  WEB_PAGES,
  MY_PHOTOS_STATUS,
  MY_PHOTOS_MESSAGES,
  SWR_KEYS,
} from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/gallery.module.scss";
import axios from "axios";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import Backdrop from "../../components/backdrop/Backdrop";
import Gallery from "../../components/gallery/Gallery";
import ImagesPreviewSlider from "../../components/imagesPreviewSlider/ImagesPreviewSlider";
import { createToast } from "../../components/toast/Toast";
import Loader from "../../components/loader";

const ACTIONS = {
  DELETE: "delete",
  PUBLISH: "publish",
};

export default function Photos() {
  const { data: userData } = useSession();
  const [userPhotos, setUserPhotos] = useState<any[] | undefined>(undefined);
  const [selectedPhotos, setSelectedPhotos] = useState<any[] | []>([]);
  const [userToken, setUserToken] = useState("");
  const [backdrop, setBackdrop] = useState(false);
  const [action, setAction] = useState("");
  const [alreadyPublishedPhotos, setAlreadyPublishedPhotos] = useState<any[] | null>(null);
  const [previewSlider, setPreviewSlider] = useState(false);
  const [indexOfSelectedSlide, setIndexOfSelectedSlide] = useState<any>(null);
  const [uncheckAll, setUncheckAll] = useState(false);

  // RECREATING ARRAY OF OBJECTS, SO WE CAN EASILY LOOP
  // OBJ { title, subtitle, userPhotos }

  // KADA OBRISEM FOTKU NA BACK-U, na front stize stariji niz

  let sources;

  if (userData) {
    sources = userData?.user?.photos.map(photos => process.env.NEXT_PUBLIC_DRUPAL_URL + photos.url);
  }

  const getSortedData = photos => {
    if (!photos) return;
    const sorted: any[] = [];

    for (let i = 0, max = photos.length; i < max; i++) {
      const obj = sorted.find(e => e.title === photos[i]?.referencedContent?.title);
      if (obj) {
        obj.userPhotos.push({ ...photos[i], idx: i });
      } else {
        sorted.push({
          title: photos[i]?.referencedContent?.title,
          subtitle: photos[i]?.referencedContent?.subtitle,
          userPhotos: [{ ...photos[i], idx: i }],
        });
      }
    }
    return sorted;
  };

  useEffect(() => {
    if (userData) {
      setUserToken(userData?.user.token);
      setUserPhotos(getSortedData(userData?.user?.photos));
    }
  }, [userData]);

  const onDeleteHandler = photo => {
    const prevState = [...selectedPhotos];
    setSelectedPhotos(
      prevState.some(({ drupalId }) => drupalId === photo.drupalId)
        ? prevState.filter(({ drupalId }) => drupalId !== photo.drupalId)
        : [...prevState, photo],
    );
  };

  // SETTING ARRAY OF PUBLISH PHOTOS, SO WE CAN CHECK IF USER CAN CONFIR PUBLISHING OR PREVENTING

  const onPublishHandler = () => {
    setAction("publish");
    selectedPhotos.length > 0 && setBackdrop(true);

    if (selectedPhotos.some(({ status }) => status === MY_PHOTOS_STATUS.PUBLISHED)) {
      setAlreadyPublishedPhotos(selectedPhotos.filter(({ status }) => status === MY_PHOTOS_STATUS.PUBLISHED));
      return;
    }
    setAlreadyPublishedPhotos(null);
  };

  // CREATES PARAMS

  const getURLParams = () => {
    return selectedPhotos.map(({ drupalId }) => `drupalId=${drupalId}`).join("&");
  };

  const sendRequest = async requestType => {
    if (alreadyPublishedPhotos && requestType === ACTIONS.PUBLISH) return;
    setBackdrop(false);
    const urlParams = getURLParams();
    const endpoint = `${requestType === ACTIONS.PUBLISH ? "publishImage" : "image"}?${urlParams}`;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
    const headers = {
      secretkey: REQUEST_SECRET,
      Authorization: userToken,
    };

    mutate(SWR_KEYS.LOADING, true);
    requestType === ACTIONS.PUBLISH
      ? await axios
          .post(
            url,
            {},
            {
              headers,
            },
          )
          .then(({ data }) => {
            mutate(SWR_KEYS.LOADING, false);

            if (data?.message) {
              createToast({ message: data.message, type: "success" });
            }

            const newUserPhotos = getSortedData(data?.photos);
            setUserPhotos(newUserPhotos);
            setSelectedPhotos([]);
            setUncheckAll(true);

            axios.get(WEB_PAGES.USER_UPDATE, {
              params: { [URL_KEYS.PHOTOS]: JSON.stringify(data?.photos) },
            });
          })
          .catch(({ response }) => {
            mutate(SWR_KEYS.LOADING, false);
            createToast({
              message: response.data?.message ?? NOTIFICATION_MESSAGES.SOMETHING_WENT_WRONG,
              type: "error",
            });
          })
      : await axios
          .delete(url, {
            headers,
          })
          .then(({ data }) => {
            mutate(SWR_KEYS.LOADING, false);
            if (data?.message) {
              createToast({ message: data.message, type: "success" });
            }

            const newUserPhotos = getSortedData(data?.photos);
            setUserPhotos(newUserPhotos);
            setSelectedPhotos([]);

            axios.get(WEB_PAGES.USER_UPDATE, {
              params: { [URL_KEYS.PHOTOS]: JSON.stringify(data?.photos) },
            });
          })
          .catch(({ response }) => {
            mutate(SWR_KEYS.LOADING, false);
            createToast({
              message: response.data?.message ?? NOTIFICATION_MESSAGES.SOMETHING_WENT_WRONG,
              type: "error",
            });
          });
  };

  // AFTER CONFIRM CLICK ON BUTTONS INSIDE POPUP
  const onPublishConfirmHandler = () => sendRequest(ACTIONS.PUBLISH);

  const onDeleteConfirmHandler = () => sendRequest(ACTIONS.DELETE);

  // open image preview slider

  const openImagesPreviewHandler = idx => {
    setPreviewSlider(!previewSlider);
    setIndexOfSelectedSlide(++idx);
  };

  // ACTIONS
  const isDeleteAction = action === ACTIONS.DELETE;
  const isPublishAction = action === ACTIONS.PUBLISH;

  // MODAL HEADLINE TEXT
  let modalHeadline;

  if (selectedPhotos && isDeleteAction) {
    modalHeadline = TEXTS.My_photos_delete_title;
  }

  if (selectedPhotos && !isDeleteAction) {
    modalHeadline = alreadyPublishedPhotos ? "Ooops" : "Publish";
  }

  return (
    <>
      <NextSeo title="Photos" description="Page description" />
      <div className={`container-small ${styles.gallery__wrapper}`}>
        <div className={`${styles.gallery__wrapper__title} title--with-icon`}>
          <Image src={icons.photo} alt="news-bell" />
          <h1>{TEXTS.MyPhotos_title}</h1>
        </div>
        {userPhotos &&
          userPhotos.map(data => {
            return (
              <Gallery
                key={`MY_PHOTOS_GALLERY_${data?.title}_${data?.subtitle}`}
                data={data}
                onDelete={onDeleteHandler}
                onClick={openImagesPreviewHandler}
                uncheckAll={uncheckAll}
              />
            );
          })}
        {!userPhotos ||
          (userPhotos && userPhotos.length === 0 && (
            <div className={styles.gallery__fallBackText}>
              <p>{MY_PHOTOS_MESSAGES.NO_IMAGES_TEXT_WEB}</p>
            </div>
          ))}
        {userPhotos && userPhotos?.length > 0 && (
          <div className={styles.gallery__buttons__wrapper}>
            <button
              className={`button buttonImage ${styles.gallery__deleteButton}`}
              type="button"
              onClick={() => {
                selectedPhotos.length > 0 && setBackdrop(true);
                setAction(ACTIONS.DELETE);
              }}
            >
              <Image src={icons.trash} alt="arrow" />
              <span>{TEXTS.Button_delete}</span>
            </button>

            <button
              className={`button buttonImage ${styles.gallery__publishButton}`}
              type="button"
              onClick={onPublishHandler}
            >
              <Image src={icons.publish} alt="publish" />
              <span>{MY_PHOTOS_MESSAGES.MY_PHOTOS_PUBLISHED}</span>
            </button>
          </div>
        )}
        {backdrop && (
          <Backdrop type="over-footer-and-header" onClose={ev => ev.target.id === "backdrop" && setBackdrop(false)}>
            <div className={styles.gallery__modal}>
              <div className={styles.gallery__modal__title}>
                <p>{modalHeadline}</p>
              </div>
              <div className={styles.gallery__modal__question}>
                {(isDeleteAction || isPublishAction) && (isDeleteAction || !alreadyPublishedPhotos) && (
                  <p>
                    {isDeleteAction && MY_PHOTOS_MESSAGES.MY_PHOTOS_DELETE_MODAL_TEXT(selectedPhotos.length)}
                    {isPublishAction && MY_PHOTOS_MESSAGES.MY_PHOTOS_PUBLISH_MODAL_TEXT(selectedPhotos.length)}
                  </p>
                )}
                {alreadyPublishedPhotos && !isDeleteAction && (
                  <p>{MY_PHOTOS_MESSAGES.MY_PHOTOS_ALREADY_PUBLISHED_TEXT}</p>
                )}
              </div>
              <div className={styles.gallery__buttons__wrapper}>
                <button
                  className={`button buttonImage ${styles.gallery__cancelButton}`}
                  type="button"
                  onClick={() => {
                    setBackdrop(false);
                    setAlreadyPublishedPhotos(null);
                  }}
                >
                  <span>{TEXTS.Button_close}</span>
                </button>
                {!alreadyPublishedPhotos && (
                  <button
                    className={`button buttonImage ${
                      isDeleteAction ? styles.gallery__deleteButton : styles.gallery__publishButton
                    }`}
                    type="button"
                    onClick={isDeleteAction ? onDeleteConfirmHandler : onPublishConfirmHandler}
                  >
                    <Image
                      src={isDeleteAction ? icons.trash : icons.publish}
                      alt={isDeleteAction ? "arrow" : "publish"}
                    />
                    <span>{isDeleteAction ? TEXTS.My_photos_delete_title : TEXTS.My_photos_upload_delete}</span>
                  </button>
                )}
              </div>
            </div>
          </Backdrop>
        )}
      </div>
      <ImagesPreviewSlider sources={sources} toggler={previewSlider} activeSlide={indexOfSelectedSlide} />
      <Loader />
    </>
  );
}
