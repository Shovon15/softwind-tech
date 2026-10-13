import { get } from "@/lib/metadata/fetch";
import HeaderComponent from "./HeaderComponent";
import api from "@/config/api/apiList";

const Header = async () => {
  const data: any = await get(api.siteInfo);
  return <HeaderComponent data={data?.data?.data} />;
};

export default Header;
