import { useQuery } from "react-query";
import Masonry from "react-masonry-css";
import { useParams } from "react-router-dom";

import useToast from "../../shared/hooks/useToast";
import useFetchWithError from "../../shared/hooks/useFetchWithError";
import Loader from "../../shared/components/UI/Loader";
import GridItem from "../components/GridItem";
import classes from "./Photos.module.css";

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  900: 2,
  500: 1,
};

const Photos = () => {
  const fetchWithError = useFetchWithError();
  const { searchTerm } = useParams();
  const searchString = searchTerm ? `search/${searchTerm}` : "";

  const [notify] = useToast();

  const photosQuery = useQuery(
    ["photos", {searchTerm}],
    ({ signal }) =>
      fetchWithError(`http://localhost:3001/api/photos/${searchString}`, {
        signal,
      }),
    {
      retry: false,
      onError: (error) => {
        notify(error.message, "error");
      }
    }
  );

  return (
    <div className={classes.container}>
      <h2>Photos{photosQuery.isFetching && <Loader />}</h2>
      {!photosQuery.isLoading && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={classes["grid-container"]}
          columnClassName={classes["grid-column"]}
        >
          {photosQuery.data?.map((photo) => {
            return <GridItem photo={photo} key={photo.id} />;
          })}
        </Masonry>
      )}
    </div>
  );
};

export default Photos;
