import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import ContentContainer from "@/components/layout/container/contentContainer";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { SITE_INFORMATION } from "@/config/seo";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getHomeJsonLd } from "@/lib/metadata/jsonLdSchemas/homeLd";
import { Metadata } from "next";
import Banner from "@/components/pages/home/components/Banner";
import ClientMarquee from "@/components/pages/home/components/ClientMarquee";
import WhySoftwindTech from "@/components/pages/home/components/WhySoftwindTech";
import Services from "@/components/pages/home/components/Services";
import SelectedWork from "@/components/pages/home/components/SelectedWork";
import Process from "@/components/pages/home/components/Process";
import Testimonials from "@/components/pages/home/components/Testimonials";
import Faq from "@/components/pages/home/components/Faq";
import ContactCta from "@/components/pages/home/components/ContactCta";

export async function generateMetadata(): Promise<Metadata> {
  return await GetMetaData({
    url: api.page.home,
    siteUrl: routes.home,
  });
}

export default function Home() {
  return (
    <SchemaWrapper jsonLd={getHomeJsonLd()}>
      <Banner />
      <ClientMarquee />
      <WhySoftwindTech />
      <Services />
      <SelectedWork />
      <Process />
      <Testimonials />
      <Faq />
      <ContactCta />
    </SchemaWrapper>
  );
}
