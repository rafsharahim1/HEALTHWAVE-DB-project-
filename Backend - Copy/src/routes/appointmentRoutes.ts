import express, { Router } from 'express';
import { RequestHandler } from 'express';
import { scheduleAppointment, getAppointmentHistory, getAppointments } from '../controllers/AppointmentController';

const router = express.Router();


router.get('/', getAppointments);
router.post('/scheduleAppointment', scheduleAppointment as RequestHandler);
router.get('/history/:patientId', getAppointmentHistory as RequestHandler);


export default router;
