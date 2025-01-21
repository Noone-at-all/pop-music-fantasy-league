interface User {
    _id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface Team {
    _id: string;
    name: string;
    userId: string;
    roster: RosterSpot[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface Artist {
    _id: string;
    name: string;
    latestRank: number;
    previousRank: number;
    didEnterTopTen: boolean;
    didEnterTopFifty: boolean;
    hadNumberOne: boolean;
    isDead: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface RosterSpot {
    artistId: string;
    isActive: boolean;
    dateAcquired: Date;
    isCanceled: boolean;
  }
  
  interface Draft {
    _id: string;
    status: 'pending' | 'active' | 'complete';
    currentRound: number;
    currentPick: number;
    pickOrder: string[]; // array of team IDs
    picks: Array<{
      teamId: string;
      artistId: string;
      round: number;
      pickNumber: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }
  