import express from 'express';
import { getHospitals , addHospital, getDepartmentCount} from '../controllers/HospitalController';
import { RequestHandler } from 'express';
const router = express.Router();


router.get('/', getHospitals);
router.post('/add-hospital', addHospital as RequestHandler);
router.get('/get-department-count/:hospitalId/', getDepartmentCount);


/* Define routes for doctor
router.get('/', getPatients);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);
*/

export default router;