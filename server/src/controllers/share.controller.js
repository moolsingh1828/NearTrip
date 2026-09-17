import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { SharedPlace } from '../models/SharedPlace.js';

const memory = new Map();

export async function createShare(req, res, next) {
  try {
    const { place } = req.body;
    if (!place?.name || !place?.lat || !place?.lng) return res.status(400).json({ message: 'A complete place is required.' });
    const slug = crypto.randomBytes(5).toString('hex');
    if (mongoose.connection.readyState === 1) await SharedPlace.create({ slug, place });
    else memory.set(slug, { place, createdAt: Date.now() });
    res.json({ slug });
  } catch (error) { next(error); }
}

export async function getShare(req, res, next) {
  try {
    let place = null;
    if (mongoose.connection.readyState === 1) place = (await SharedPlace.findOne({ slug: req.params.slug }).lean())?.place || null;
    else place = memory.get(req.params.slug)?.place || null;
    if (!place) return res.status(404).json({ message: 'Shared place not found.' });
    res.json({ place });
  } catch (error) { next(error); }
}
