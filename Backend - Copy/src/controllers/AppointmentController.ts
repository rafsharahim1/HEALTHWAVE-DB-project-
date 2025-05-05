import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import { Appointment } from '../types/appointment';
import pool from '../config/db';

export const scheduleAppointment: RequestHandler = async (req, res) => {
    try {
      const { patientId, doctorId, appointmentDateTime } = req.body;
  
      // Ensure appointmentDateTime is a valid Date
      const appointmentDate = new Date(appointmentDateTime);
  
      if (!patientId || !doctorId || !appointmentDateTime || isNaN(appointmentDate.getTime())) {
        res.status(400).json({ message: 'Valid Patient ID, Doctor ID, and Appointment DateTime are required fields.' });
        return;
      }
  
      // Check if patient exists
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
  
      // Check if doctor exists
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
  
      // Check if doctor is available at the specified time
      const [availabilityResult]: any = await pool.query(
        `SELECT COUNT(*) AS availability 
         FROM Appointment WHERE Doctor_ID = ? AND Appointment_Time = ?`, 
        [doctorId, appointmentDate]
      );
  
      if (availabilityResult[0].availability > 0) {
        res.status(400).json({ message: 'Error: Doctor is not available at the specified time.' });
        return;
      }
  
      // Set default status for appointment
      const status = 'Scheduled';  // Default status for new appointments
  
      // Insert the appointment into the database
      const [insertResult]: any = await pool.query(
        `INSERT INTO Appointment (Patient_ID, Doctor_ID, Appointment_Time, Status) 
         VALUES (?, ?, ?, ?)`, 
        [patientId, doctorId, appointmentDate, status]
      );
  
      res.status(201).json({
        message: `Appointment successfully scheduled with Dr. ${doctorName} for ${patientName} on ${appointmentDate.toISOString()}.`,
        appointmentId: insertResult.insertId,
      });
    } catch (err: any) {
      console.error(err); // Log the error for debugging purposes
      res.status(500).json({ message: 'Error scheduling appointment', error: err.message });
    }
  };
  

export const getAppointmentHistory: RequestHandler = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Validate input
    if (!patientId || isNaN(Number(patientId))) {
      res.status(400).json({ message: 'Invalid or missing Patient ID.' });
      return;
    }

    // Check if the patient has appointments
    const [appointmentCountResult]: any = await pool.query(
      `SELECT COUNT(*) AS appointmentCount 
       FROM Appointment 
       WHERE Patient_id = ?`,
      [patientId]
    );

    const appointmentCount = appointmentCountResult[0]?.appointmentCount || 0;

    if (appointmentCount === 0) {
      res.status(404).json({ message: 'No appointments found for this patient.' });
      return;
    }

    // Fetch appointment history
    const [appointments]: any = await pool.query(
      `SELECT 
          d.Doctor_ID AS doctorId,
          d.First_Name AS doctorFirstName,
          d.Last_Name AS doctorLastName,
          d.Phone_Number AS doctorPhone,
          dep.Name AS departmentName,
          a.Appointment_Time AS appointmentDateTime,
          IFNULL(a.Status, 'Scheduled') AS appointmentStatus
       FROM Appointment a
       JOIN Doctor d ON a.Doctor_id = d.Doctor_ID
       JOIN Department dep ON d.Department_ID = dep.Department_ID
       WHERE a.Patient_id = ?
       ORDER BY a.Appointment_Time DESC`,
      [patientId]
    );

    // Respond with the appointment history
    res.status(200).json({
      message: 'Appointment history retrieved successfully.',
      appointments,
    });
  } catch (err: any) {
    console.error('Error retrieving appointment history:', err);
    res.status(500).json({ message: 'Error retrieving appointment history.', error: err.message });
  }
};


export const getAppointments = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Appointment');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};
