import { Request, Response } from 'express';
import pool from '../config/db';
import {Hospital} from '../types/hospital';
import { RequestHandler } from 'express';


export const getHospitals = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Hospital');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export const addHospital: RequestHandler = async (req, res) => {
  const { Hospital_id, Hospital_Name, Hospital_Address, Hospital_PhoneNo, State, Zip_Code }: Hospital = req.body;
  
  if (!Hospital_id) {
      res.status(400).json({ message: 'Missing required fields' });
      return ;
  }

  try {
      const query = `
          INSERT INTO Hospital (Hospital_id, Hospital_Name, Hospital_Address,Hospital_PhoneNo, State,Zip_Code)
          VALUES (?, ?, ?, ?, ?,?)
      `;
      
      // If fields are missing, set them to null or their default values
      const values = [
          Hospital_id,
          Hospital_Name || null,
          Hospital_Address || null,
          Hospital_PhoneNo || null,
          State || null,
          Zip_Code || null
      ];

      const [result] = await pool.query(query, values);

      res.status(201).json({ message: 'Hospital added successfully', result });
  } catch (error: any) {
      console.error('Error inserting Hospital:', error);
      res.status(500).json({ message: 'Error adding Hospital', error: error.message });
  }
};


// Controller for get_department_count
export const getDepartmentCount = async (req: Request, res: Response) => {
  const { hospitalId } = req.params;

  try {
      const [result] = await pool.execute('SELECT get_department_count(?) AS departmentCount', [hospitalId]);
      res.status(200).json({ departmentCount: (result as any)[0].departmentCount });
  } catch (error: unknown) {
    
      
      if (error instanceof Error) {
          res.status(500).json({ error: error.message });
      } else {
          res.status(500).json({ error: 'An unknown error occurred' });
      }
  }
};