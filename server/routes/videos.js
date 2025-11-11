import express from 'express';
import { getById, update } from '../db/jsonStore.js';

const router = express.Router();
const COLL = 'courses';

// Get videos
router.get('/:courseId', async (req,res)=>{
  try{
    const c = await getById(COLL, req.params.courseId);
    if (!c) return res.status(404).json({message:'Course not found'});
    res.json(c.videos || []);
  }catch(e){ res.status(500).json({message:e.message}); }
});

// Add video (optional admin key)
router.post('/:courseId', async (req,res)=>{
  try{
    const { ADMIN_KEY } = process.env;
    if (ADMIN_KEY && req.headers['x-admin-key'] !== ADMIN_KEY)
      return res.status(403).json({ message:'Admin key required' });

    const c = await getById(COLL, req.params.courseId);
    if (!c) return res.status(404).json({message:'Course not found'});

    c.videos ||= [];
    const { title, videoUrl, duration, order } = req.body;
    const v = {
      _id: crypto.randomUUID(),
      title, videoUrl, duration,
      order: order ?? c.videos.length,
      subtitles: {},
      boardTextData: []
    };
    c.videos.push(v);
    const saved = await update(COLL, c._id, c);
    res.json(v);
  }catch(e){ res.status(500).json({message:e.message}); }
});

// Update subtitles
router.put('/:courseId/:videoIndex/subtitles', async (req,res)=>{
  try{
    const { language, text } = req.body;
    const c = await getById(COLL, req.params.courseId);
    const idx = Number(req.params.videoIndex);
    if (!c || !c.videos || !c.videos[idx]) return res.status(404).json({message:'Video not found'});
    c.videos[idx].subtitles ||= {};
    c.videos[idx].subtitles[language] = text;
    await update(COLL, c._id, c);
    res.json(c.videos[idx]);
  }catch(e){ res.status(500).json({message:e.message}); }
});

// Update board text data
router.put('/:courseId/:videoIndex/board-text', async (req,res)=>{
  try{
    const { text, timestamp, language, translatedText } = req.body;
    const c = await getById(COLL, req.params.courseId);
    const idx = Number(req.params.videoIndex);
    if (!c || !c.videos || !c.videos[idx]) return res.status(404).json({message:'Video not found'});
    c.videos[idx].boardTextData ||= [];
    c.videos[idx].boardTextData.push({
      text, timestamp, language, translatedText: translatedText || {}
    });
    await update(COLL, c._id, c);
    res.json(c.videos[idx]);
  }catch(e){ res.status(500).json({message:e.message}); }
});

export default router;
