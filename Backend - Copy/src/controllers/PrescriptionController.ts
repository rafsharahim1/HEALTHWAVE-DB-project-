import { Request, Response } from 'express';
import pool from '../config/db';

// Controller for Get_Medicines_In_Prescription
export const getMedicinesInPrescription = async (req: Request, res: Response) => {
    const { prescriptionId } = req.params;

    try {
        const [result] = await pool.execute('SELECT Get_Medicines_In_Prescription(?) AS medicineList', [prescriptionId]);
        res.status(200).json({ medicineList: (result as any)[0].medicineList });
    } catch (error) {
        // Narrowing the type of the error to handle the 'unknown' type
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

export const getPrescriptions = async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Prescription');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
  };

  export const addPrescription = async (req: Request, res: Response) => {
    const { prescription_id, Date, Cost, Patient_id } = req.body;
  
    // Check if required fields are present
    if (!prescription_id || !Patient_id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
  
    try {
      const query = `
        INSERT INTO Prescription (prescription_id, Date, Cost, Patient_id)
        VALUES (?, ?, ?, ?)
      `;
  
      const values = [
        prescription_id,
        Date || null, 
        Cost || null, 
        Patient_id
      ];
  
      const [result] = await pool.query(query, values);
  
      res.status(201).json({ message: 'Prescription added successfully', result });
    } catch (error: any) {
      console.error('Error inserting prescription:', error);
      res.status(500).json({ message: 'Error adding prescription', error: error.message });
    }
  };