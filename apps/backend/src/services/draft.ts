export class DraftService {
  static async getCurrentPick(draft: Draft): Promise<{ teamId: string; round: number; pick: number }> {
    const totalTeams = draft.pickOrder.length;
    const isSnakeRound = draft.currentRound % 2 === 0;
    
    const pickIndex = isSnakeRound 
      ? totalTeams - 1 - ((draft.currentPick - 1) % totalTeams)
      : (draft.currentPick - 1) % totalTeams;

    return {
      teamId: draft.pickOrder[pickIndex],
      round: draft.currentRound,
      pick: draft.currentPick
    };
  }

  static async makePick(draft: Draft, teamId: string, artistId: string): Promise<void> {
    const currentPick = await this.getCurrentPick(draft);
    
    if (currentPick.teamId !== teamId) {
      throw new Error('not your turn fam');
    }

    const artistAlreadyDrafted = draft.picks.some(p => p.artistId === artistId);
    if (artistAlreadyDrafted) {
      throw new Error('artist already drafted, try again');
    }

    draft.picks.push({
      teamId,
      artistId,
      round: currentPick.round,
      pickNumber: draft.currentPick
    });

    if (draft.currentPick >= draft.pickOrder.length * 9) {
      draft.status = 'complete';
    } else {
      draft.currentPick++;
      if (draft.currentPick > draft.pickOrder.length) {
        draft.currentRound++;
        draft.currentPick = 1;
      }
    }

    await draft.save();
  }
}