export type DiscogsRelease = {
  title: string;
  id: string;
  thumb: string;
  identifiers: [
    {
      type: string;
      value: string;
    },
  ];
  artists: [
    {
      name: string;
    },
  ];
};
