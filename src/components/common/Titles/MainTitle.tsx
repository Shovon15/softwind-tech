import decodeHtmlEntities from "@/utils/helpers/decodeHtmlEntities";

const MainTitle = ({
  text1,
  text2,
  className = "",
  textColor = "text-[#000000]",
  spanColor = "text-[#E4002B]",
}: any) => {
  return (
    <h2
      className={`text-[clamp(2.25rem,3.333vw,4rem)] leading-[clamp(2.5rem,3.333vw,4rem)] font-normal text-center font-heading   ${textColor} ${className}`}
    >
      <div dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(text1) }} />
      <span className={`${spanColor}`}>{text2}</span>
    </h2>
  );
};

export default MainTitle;
