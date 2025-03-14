export default interface Competitor {
  regId: number;
  wcaId: string;
  name: string;
  group: number;
  isPad: boolean; // TODO - make this part of an extension of Competitor since this is only for backend
}

export const newCompetitor: () => Competitor = () => ({
  regId: 0,
  wcaId: "",
  name: "",
  group: 1,
  isPad: false,
});

export const padCompetitor: () => Competitor = () => ({
  ...newCompetitor(),
  isPad: true,
});
