export default interface Competitor {
  regId: number
  wcaId: string
  name: string
  group: number
}

export const newCompetitor: () => Competitor = () => ({
  regId: 0,
  wcaId: '',
  name: '',
  group: 1
})