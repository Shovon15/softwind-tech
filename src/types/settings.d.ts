interface IGeneralSection {
  name: "General";
  slug: "general";
  items: any[];
}

interface ISocialSection {
  name: "Social";
  slug: "social";
  items: any[];
}

type ISettingsSchema = {
  general: IGeneralSection;
  social: ISocialSection;
};
type ISettingsState = ISettingsSchema & {
  dataFetched: boolean;
};
