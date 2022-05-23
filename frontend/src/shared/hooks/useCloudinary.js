import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useCallback } from "react";

const useCloudinary = () => {
  const getCloudinaryImage = useCallback((photo, options = { width: 300 }) => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dau7fdnej",
      },
    });

    const { width } = options;

    const myImage = cld.image(photo.publicId);
    myImage.resize(fill().width(width));

    return myImage;
  }, []);

  return [getCloudinaryImage];
};

export default useCloudinary;
