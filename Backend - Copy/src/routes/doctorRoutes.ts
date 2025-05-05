// First, try this version of your routes file (routes/doctorRoutes.ts):
import express, { Router } from 'express';
import { RequestHandler } from 'express';
import { addDoctor, getDoctors } from '../controllers/DoctorController';

const router: Router = express.Router();

// Cast the handlers to RequestHandler
router.get('/', getDoctors as RequestHandler);
router.post('/add-doctor', addDoctor as RequestHandler);

export default router;