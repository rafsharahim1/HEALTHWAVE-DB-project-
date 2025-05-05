import { RequestHandler } from 'express';
import pool from '../config/db';
import { Doctor } from '../types/doctor';

export const getDoctors: RequestHandler = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Doctor');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
};

export const addDoctor: RequestHandler = async (req, res) => {
    const { Doctor_ID, First_Name, Last_Name, Phone_Number, Department_ID }: Doctor = req.body;
    
    if (!Doctor_ID) {
        res.status(400).json({ message: 'Missing required fields' });
        return ;
    }

    try {
        const query = `
            INSERT INTO Doctor (Doctor_ID, First_Name, Last_Name, Phone_Number, Department_ID)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // If fields are missing, set them to null or their default values
        const values = [
            Doctor_ID,
            First_Name || null,
            Last_Name || null,
            Phone_Number || null,
            Department_ID || null,
        ];

        const [result] = await pool.query(query, values);

        res.status(201).json({ message: 'Doctor added successfully', result });
    } catch (error: any) {
        console.error('Error inserting doctor:', error);
        res.status(500).json({ message: 'Error adding doctor', error: error.message });
    }
};