import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import { Medicine } from '../types/medicine';
import pool from '../config/db';


export const getMedicine = async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Medicine');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch medicines' });
    }
  };
  
  export const addMedicine: RequestHandler = async (req, res) => {
    const { Medicine_ID, Medicine_Name, Medicine_Type, Price, Stock, Pharmacy_ID }: Medicine = req.body;
  
    if (!Medicine_ID || !Medicine_Name || !Price || !Stock || !Pharmacy_ID) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
  
    try {
      const query = `
        INSERT INTO Medicine (Medicine_ID, Medicine_Name, Medicine_Type, Price, Stock, Pharmacy_ID)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
  
      const values = [
        Medicine_ID,
        Medicine_Name,
        Medicine_Type || null,  
        Price,
        Stock,
        Pharmacy_ID
      ];
  
      const [result] = await pool.query(query, values);
      res.status(201).json({ message: 'Medicine added successfully', result });
    } catch (error: any) {
      console.error('Error inserting Medicine:', error);
      res.status(500).json({ message: 'Error adding Medicine', error: error.message });
    }
  };
  