import express from 'express';
import { ScoringService, DraftService } from '../services';
import { User, Artist, Team, Draft } from '../db/models/schemas';

const router = express.Router();

// auth routes
router.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  // hash password, create user, etc
});

// teams routes
router.get('/teams/:id', async (req, res) => {
  const team = await Team.findById(req.params.id).populate('roster.artistId');
  if (!team) return res.status(404).json({ error: 'team not found' });
  
  const score = await ScoringService.calculateTeamScore(team);
  res.json({ ...team.toJSON(), score });
});

// draft routes
router.post('/draft/pick', async (req, res) => {
  const { draftId, teamId, artistId } = req.body;
  
  const draft = await Draft.findById(draftId);
  if (!draft || draft.status !== 'active') {
    return res.status(400).json({ error: 'invalid draft' });
  }

  try {
    await DraftService.makePick(draft, teamId, artistId);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// scoreboard route
router.get('/scoreboard', async (req, res) => {
  const teams = await Team.find().populate('roster.artistId');
  
  const scores = await Promise.all(teams.map(async team => ({
    team: team.name,
    score: await ScoringService.calculateTeamScore(team)
  })));

  res.json(scores.sort((a, b) => b.score - a.score));
});

export default router;