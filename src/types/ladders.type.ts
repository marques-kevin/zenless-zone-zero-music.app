export type Ladder = {
  ladder: {
    id: string;
    rank: number;
    points: number;
    popularity: number;
  }[];
  characters: Record<
    string,
    {
      id: string;
      total_votes: number;
      popularity: number;
      points: number;
      rank: number;
      total_votes_1: number;
      total_votes_2: number;
      total_votes_3: number;
      total_votes_4: number;
      total_votes_5: number;
    }
  >;
  total_votes: number;
};
