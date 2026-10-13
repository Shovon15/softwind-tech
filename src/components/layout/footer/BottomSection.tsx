"use client";

import NavLink from "@/components/common/link/NavLink";
import SocialLinks from "@/components/common/icons/SocialLinks";
import routes from "@/config/routes";
import { SITE_INFORMATION } from "@/config/seo";
import { useAppSelector } from "@/store/hooks";

const BottomSection = () => {
  const { settings, socialLinks } = useAppSelector((state) => state.navigation);
  const setting = settings.items[0];

  return (
    <div className="">
      {(setting?.promo_bar || socialLinks.items.length > 0) && (
        <div className="flex lg:flex-row flex-col justify-around items-center bg-primary text-center gap-5 text-white py-5">
          <span className="font-heading font-[400] text-[16px] leading-[100%]">
            {setting?.promo_bar || ""}
          </span>
          {socialLinks.items.length > 0 && (
            <SocialLinks links={socialLinks.items} className="flex" />
          )}
        </div>
      )}

      <div className="bg-black text-center text-white py-5 flex flex-col md:flex-row-reverse justify-around items-center gap-5">
        <div className=" flex flex-col md:flex-row gap-2">
          <NavLink href={routes.termsAndConditions} className="">
            Terms & Conditions
          </NavLink>
          <NavLink href={routes.privacyPolicy} className="">
            Privacy Policy
          </NavLink>
        </div>
        <p className="!mb-0 flex items-center gap-1">
          <span className="text-[20px]"> ©</span> {new Date().getFullYear()}{" "}
          {SITE_INFORMATION.appName}. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default BottomSection;
