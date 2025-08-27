import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default async (url: string, type: string, title: string, description: string, cc: string, picture: string) => {
  const headers = {
    'key': process.env.API_KEY,  
    'url': url,
    'type': type,
    'title': title,
    'description': description,
    'cc': cc,
    'picture': picture
  };

  try {
    const response = await axios.get(`${process.env.API_URL}/api/add`, { headers });

    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  };
};