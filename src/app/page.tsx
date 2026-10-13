import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import ContentContainer from "@/components/layout/container/contentContainer";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { SITE_INFORMATION } from "@/config/seo";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getHomeJsonLd } from "@/lib/metadata/jsonLdSchemas/homeLd";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await GetMetaData({
    url: api.page.home,
    siteUrl: routes.home,
  });
}

export default function Home() {
  return (
    <SchemaWrapper jsonLd={getHomeJsonLd()}>
      <ContentContainer className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 pt-40 pb-20 text-center">
        <h1 className="font-heading text-4xl lg:text-6xl">
          {SITE_INFORMATION.appName}
        </h1>
        <p className="font-body max-w-xl text-lg">
          {SITE_INFORMATION.metaDescription}
        </p>
      </ContentContainer>
    </SchemaWrapper>
  );
}
