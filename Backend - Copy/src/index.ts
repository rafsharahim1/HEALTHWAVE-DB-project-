import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import patientRouter from './routes/patientRoutes';
import doctorRouter from './routes/doctorRoutes';
import HospitalRouter from './routes/HospitalRoutes';
import AppointmentRouter from './routes/appointmentRoutes';
import DepartmentRouter from './routes/departmentRoutes';
import PrescriptionRouter from './routes/prescriptionRoutes';
import MedicineRouter from './routes/medicineRoutes';
import PharmacyRouter from './routes/pharmacyRoutes'

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Middleware to parse JSON request bodies


// Mount the routers to their respective routes

app.use('/api/patients', patientRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/hospitals', HospitalRouter);
app.use('/api/appointments', AppointmentRouter);
app.use('/api/departments',DepartmentRouter);
app.use('/api/prescriptions',PrescriptionRouter);
app.use('/api/medicine',MedicineRouter);
app.use('/api/pharmacies',PharmacyRouter);


// Start server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
