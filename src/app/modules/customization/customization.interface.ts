export type TCustomization = {
  name: string;
  phoneNumber: string;
  variantType: {
    key: string;
    label: string;
  };
  customizations: {
    reclinerType: {
      key: string;
      label: string;
    };
    armrestType: {
      key: string;
      label: string;
    };
    middleConsole: {
      key: string;
      label: string;
    };
    seatType: {
      key: string;
      label: string;
    };
    backHeight: {
      key: string;
      label: string;
    };
  };
  fabric: {
    key: string;
    label: string;
  }[];
  color: {
    key: string;
    label: string;
  }[];
};
