export default interface Competitor {
  id: number
  name: string
  group: number
}

export const newCompetitor: () => Competitor = () => ({
  id: 1,
  name: '',
  group: 1
})