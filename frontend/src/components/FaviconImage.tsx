import { getFaviconUrl } from "../utils/utils";

const FaviconImage = ({ url }: { url: string }) => {
  return (
    <img
      src={getFaviconUrl(url)}
      alt="Favicon"
      className="w-10 h-10 rounded-md mr-2"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/fallback.jpeg";
      }}
    />
  );
};

export default FaviconImage;
