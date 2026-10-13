export const getVideoType = (url: string = "") => {
  const ext = url.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
      return "video/ogg";
    case "mov":
      return "video/quicktime";
    default:
      return "video/mp4"; // fallback
  }
};
