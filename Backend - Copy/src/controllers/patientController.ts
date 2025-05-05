import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import pool from '../config/db';
import { Patient } from '../types/patient';  // Import the Patient type


export const getPatients = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Patient');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export const addPatient: RequestHandler = async (req, res) => {
  const { patient_id, First_Name, Last_Name, Address, PhoneNo }: Patient = req.body;
  
  if (!patient_id) {
      res.status(400).json({ message: 'Missing required fields' });
      return ;
  }

  try {
      const query = `
          INSERT INTO Patient (patient_id, First_Name, Last_Name, Address, PhoneNo)
          VALUES (?, ?, ?, ?, ?)
      `;
      
      // If fields are missing, set them to null or their default values
      const values = [
          patient_id,
          First_Name || null,
          Last_Name || null,
          Address || null,
          PhoneNo || null,
      ];

      const [result] = await pool.query(query, values);

      res.status(201).json({ message: 'Patient added successfully', result });
  } catch (error: any) {
      console.error('Error inserting Patient:', error);
      res.status(500).json({ message: 'Error adding Patient', error: error.message });
  }
};


export const updatePatient: RequestHandler = async (req, res) => {
  try {
    const { patientId, newPhoneNumber, newAddress } = req.body;

    // Validate mandatory field
    if (!patientId) {
      res.status(400).json({ message: 'Error: Patient ID is a required field.' });
      return;
    }

    // Check if the patient exists
    const [existingPatient]: any = await pool.query('SELECT 1 FROM Patient WHERE Patient_ID = ?', [patientId]);

    if (existingPatient.length === 0) {
      res.status(404).json({ message: `Error: Patient with ID ${patientId} does not exist.` });
      return;
    }

    // Update logic
    await modifyPatientContact({ patientId, newPhoneNumber, newAddress });

    res.status(200).json({ message: 'Patient contact information updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error updating patient contact information', error: err.message });
  }
};

// Helper function to update patient details
const modifyPatientContact = async ({
  patientId,
  newPhoneNumber,
  newAddress,
}: {
  patientId: number;
  newPhoneNumber?: string;
  newAddress?: string;
}) => {
  const updateQueries: Array<Promise<any>> = [];

  // Update phone number if provided
  if (newPhoneNumber && newPhoneNumber.trim() !== '') {
    const updatePhoneQuery = 'UPDATE Patient SET PhoneNo = ? WHERE Patient_ID = ?';
    updateQueries.push(pool.query(updatePhoneQuery, [newPhoneNumber, patientId]));
  }

  if (newAddress && newAddress.trim() !== '') {
    const updateAddressQuery = 'UPDATE Patient SET Address = ? WHERE Patient_ID = ?';
    updateQueries.push(pool.query(updateAddressQuery, [newAddress, patientId]));
  }

  if (updateQueries.length === 0) {
    throw new Error('No updates were made. Both phone number and address inputs are empty.');
  }
  await Promise.all(updateQueries);
};

/*
export const scheduleAppointment: RequestHandler = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDateTime } = req.body;

    if (!patientId || !doctorId || !appointmentDateTime) {
      res.status(400).json({ message: 'Patient ID, Doctor ID, and Appointment DateTime are required fields.' });
      return;
    }

    const [patientResult]: any = await pool.query(
      `SELECT CONCAT(First_Name, ' ', Last_Name) AS patientName 
       FROM Patient WHERE Patient_ID = ?`, 
      [patientId]
    );

    if (patientResult.length === 0) {
      res.status(404).json({ message: 'Error: Patient does not exist.' });
      return;
    }
    const patientName = patientResult[0].patientName;

    const [doctorResult]: any = await pool.query(
      `SELECT CONCAT(First_Name, ' ', Last_Name) AS doctorName 
       FROM Doctor WHERE Doctor_ID = ?`, 
      [doctorId]
    );

    if (doctorResult.length === 0) {
      res.status(404).json({ message: 'Error: Doctor does not exist.' });
      return;
    }
    const doctorName = doctorResult[0].doctorName;

    const [availabilityResult]: any = await pool.query(
      `SELECT COUNT(*) AS availability 
       FROM Appointment WHERE Doctor_ID = ? AND Appointment_Time = ?`, 
      [doctorId, appointmentDateTime]
    );

    if (availabilityResult[0].availability > 0) {
      res.status(400).json({ message: 'Error: Doctor is not available at the specified time.' });
      return;
    }

    const [insertResult]: any = await pool.query(
      `INSERT INTO Appointment (Patient_ID, Doctor_ID, Appointment_Time) 
       VALUES (?, ?, ?)`, 
      [patientId, doctorId, appointmentDateTime]
    );

    res.status(201).json({
      message: `Appointment successfully scheduled with Dr. ${doctorName} for ${patientName} on ${appointmentDateTime}.`,
      appointmentId: insertResult.insertId,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Error scheduling appointment', error: err.message });
  }
};
*/
