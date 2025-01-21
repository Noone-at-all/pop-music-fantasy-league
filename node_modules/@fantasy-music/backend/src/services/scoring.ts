export class ScoringService {
    private static calculateBaseScore(oldRank: number, newRank: number): number {
      return Math.log(oldRank / newRank) * 10;
    }
  
    private static calculateMultipliers(artist: Artist, baseScore: number): number {
      if (baseScore <= 0) return 1;
  
      let multiplier = 1;
      
      if (artist.didEnterTopTen) multiplier *= 1.5;
      if (artist.didEnterTopFifty) multiplier *= 1.2;
      if (artist.latestRank <= 6 && new Date().getMonth() !== 0) multiplier *= 1.5;
      if (artist.hadNumberOne) multiplier *= 1.3;
      if (artist.isDead) multiplier *= 10;
  
      return multiplier;
    }
  
    static calculateArtistScore(artist: Artist): number {
      const baseScore = this.calculateBaseScore(artist.previousRank, artist.latestRank);
      const multiplier = this.calculateMultipliers(artist, baseScore);
      return baseScore * multiplier;
    }
  
    static async calculateTeamScore(team: Team): Promise<number> {
      const activeArtists = await Artist.find({
        _id: { $in: team.roster.filter(r => r.isActive).map(r => r.artistId) }
      });
  
      return activeArtists.reduce((total, artist) => {
        return total + this.calculateArtistScore(artist);
      }, 0);
    }
  }