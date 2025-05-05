import express, { Router } from 'express';
import { RequestHandler } from 'express';
import { addDepartment, getDepartments, getDoctorCount } from '../controllers/DepartmentController';

const router: Router = express.Router();

router.get('/', getDepartments);
router.post('/add-department', addDepartment);
router.get('/doctor-count/:departmentId', getDoctorCount);

export default router;
