import { Router } from 'express';
import { getMedicinesInPrescription, getPrescriptions , addPrescription} from '../controllers/PrescriptionController'; // Adjust path if needed

const router = Router();

router.get('/get-medicine/:prescriptionId', getMedicinesInPrescription);
router.get('/', getPrescriptions);
router.post('/add-prescription',addPrescription);


export default router;