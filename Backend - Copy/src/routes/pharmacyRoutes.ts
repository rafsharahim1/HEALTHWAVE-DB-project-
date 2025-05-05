import express from 'express';
import { RequestHandler } from 'express';
import { getPharmacies, addPharmacy }  from '../controllers/PharmacyController';

const router = express.Router();

router.get('/', getPharmacies);
router.post('/add-pharmacy',addPharmacy);

export default router;
