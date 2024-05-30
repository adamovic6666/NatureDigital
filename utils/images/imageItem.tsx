// import axios from "axios";
// import Image from "next/image";

const ImageItem = async () => {
  // try {
  //   const { data } = await axios.get(`${process.env.NEXT_PUBLIC_DRUPAL_URL}/getImage/${imageStyle}/${fileId || 1}`, {
  //     params: {
  //       responseType: "object",
  //     },
  //   });

  //   console.log(data);
  //   if (data.url && data.width && data.height) {
  //     return (
  //       <Image
  //         src={data.url}
  //         alt={alt || "No image"}
  //         width={parseInt(data.width || "480", 10)}
  //         height={parseInt(data.height || "480", 10)}
  //       />
  //     );
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  return <div />;
  // return <img src={`${process.env.NEXT_PUBLIC_DRUPAL_URL}/getImage/mobile_medium/${fileId || 1}`} />;
};

export default ImageItem;
