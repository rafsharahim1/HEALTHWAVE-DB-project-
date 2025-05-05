import { Request, Response } from 'express';
import pool from '../config/db';

export const getDepartments = async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Department');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch departments' });
    }
  };

  export const addDepartment = async (req: Request, res: Response) => {
    const { Department_ID, Name, Hospital_ID } = req.body;
  
    if (!Department_ID) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
  
    try {
      const query = `
        INSERT INTO Department (Department_ID, Name, Hospital_ID)
        VALUES (?, ?, ?)
      `;
      
      // If Hospital_ID is not provided, set it to null
      const values = [
        Department_ID,
        Name,
        Hospital_ID || null
      ];
  
      const [result] = await pool.query(query, values);
  
      res.status(201).json({ message: 'Department added successfully', result });
    } catch (error: any) {
      console.error('Error inserting department:', error);
      res.status(500).json({ message: 'Error adding department', error: error.message });
    }
  };
export const getDoctorCount = async (req: Request, res: Response) => {
    const { departmentId } = req.params;
  
    if (!departmentId) {
      res.status(400).json({ message: 'Department ID is required' });
      return;
    }
  
    try {
      const query = 'SELECT get_doctor_count(?) AS doctor_count';
      const [rows]: any = await pool.query(query, [departmentId]);
  
      if (rows.length > 0) {
        res.json({ doctorCount: rows[0].doctor_count });
      } else {
        res.status(404).json({ message: 'Department not found or no doctors in this department' });
      }
    } catch (error: any) {
      console.error('Error fetching doctor count:', error);
      res.status(500).json({ message: 'Error fetching doctor count', error: error.message });
    }
  };
