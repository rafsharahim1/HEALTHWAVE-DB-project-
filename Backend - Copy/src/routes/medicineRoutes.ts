import express from 'express';
import { RequestHandler } from 'express';
import { getMedicine, addMedicine }  from '../controllers/MedicineController';

const router = express.Router();

router.get('/', getMedicine);
router.post('/add-medicine',addMedicine);

export default router;
