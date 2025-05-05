import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import { Pharmacy } from '../types/pharmacy';
import pool from '../config/db';


export const getPharmacies = async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Pharmacy');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch pharmacies' });
    }
  };
  

  export const addPharmacy: RequestHandler = async (req, res) => {
    const { pharmacy_id, pharmacy_name, Phone_Number, Address }: Pharmacy = req.body;
  
    if (!pharmacy_id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
  
    try {
      const query = `
        INSERT INTO Pharmacy (pharmacy_id, pharmacy_name, Phone_Number, Address)
        VALUES (?, ?, ?, ?)
      `;
  
      const values = [
        pharmacy_id,
        pharmacy_name || null,  
        Phone_Number || null,   
        Address || null         
      ];
  
      const [result] = await pool.query(query, values);
      res.status(201).json({ message: 'Pharmacy added successfully', result });
    } catch (error: any) {
      console.error('Error inserting Pharmacy:', error);
      res.status(500).json({ message: 'Error adding Pharmacy', error: error.message });
    }
  };
  