import express from 'express';
import { RequestHandler } from 'express';
import { getPatients, addPatient, updatePatient }  from '../controllers/patientController';

const router = express.Router();

router.get('/', getPatients);
router.post('/add-patient', addPatient as RequestHandler);
router.put('/updatePatient', updatePatient);


export default router;
