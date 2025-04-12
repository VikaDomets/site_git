
// import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const ExhibitionsContext = createContext();

// export const ExhibitionsProvider = ({ children }) => {
//   const [exhibitions, setExhibitions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Функція для завантаження виставок з пагінацією
//   const fetchExhibitions = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/api/user/exhibitions/pag?page=${page}&limit=${limit}`);
//       setExhibitions(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   // Функція для отримання однієї виставки
//   const fetchSingleExhibition = async (id) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/api/exhibitions/one/${id}`);
//       setLoading(false);
//       return response.data;
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//       return null;
//     }
//   };

//   // Функція для додавання виставки
//   const addExhibition = async (exhibitionData) => {
//     try {
//       setLoading(true);
//       const formData = new FormData();
//       Object.keys(exhibitionData).forEach(key => {
//         formData.append(key, exhibitionData[key]);
//       });

//       const response = await axios.post('/api/user/exhibitions/pag', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       setExhibitions(prev => [...prev, response.data]);
//       setLoading(false);
//       return response.data;
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//       throw err;
//     }
//   };

//   // Завантажуємо виставки при першому рендері
//   useEffect(() => {
//     fetchExhibitions();
//   }, []);

//   return (
//     <ExhibitionsContext.Provider value={{ 
//       exhibitions, 
//       loading, 
//       error, 
//       addExhibition, 
//       fetchSingleExhibition,
//       fetchExhibitions 
//     }}>
//       {children}
//     </ExhibitionsContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ExhibitionsContext = createContext();
const API_URL = 'http://127.0.0.1:8000/';

export const ExhibitionsProvider = ({ children }) => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExhibitions = async (page = 1, limit = 3) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/exhibitions/pag/`, {
        params: { page, limit }
      });
  
      // Отримуємо виставки з поля 'results'
      setExhibitions(response.data.results || []);
  
      // Обчислюємо кількість сторінок з поля 'count'
      const totalCount = response.data.count;
  
      if (totalCount !== undefined) {
        setTotalPages(Math.ceil(totalCount / limit));
      } else {
        setTotalPages(1); // fallback
      }
  
      setError(null);
    } catch (err) {
      console.error('Помилка при завантаженні виставок:', err);
      setError(err.response?.data?.message || err.message);
      setExhibitions([]);
    } finally {
      setLoading(false);
    }
  };
  
/*
  // Список виставок з пагінацією
  const fetchExhibitions = async (page = 1, limit = 3) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/exhibitions/pag/`, {
        params: { page, limit }
      });
  
      setExhibitions(response.data.exhibitions || response.data);
  
      // Якщо бекенд повертає totalCount:
      const totalCount = response.data.totalCount;
  
      // або якщо повертає totalPages:
      const total = response.data.totalPages;
  
      if (totalCount !== undefined) {
        setTotalPages(Math.ceil(totalCount / limit));
      } else if (total !== undefined) {
        setTotalPages(total);
      } else {
        setTotalPages(1); // fallback
      }
  
      setError(null);
    } catch (err) {
      console.error('Помилка при завантаженні виставок:', err);
      setError(err.response?.data?.message || err.message);
      setExhibitions([]);
    } finally {
      setLoading(false);
    }
  };
*/
  // Деталі однієї виставки
  const fetchSingleExhibition = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/exhibitions/one/${id}/`);
      return response.data;
    } catch (err) {
      console.error('Помилка при завантаженні виставки:', err);
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Створення виставки авторизованим користувачем
  const addExhibition = async (exhibitionData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(exhibitionData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axios.post(`${API_URL}api/exhibitions/create/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`
          //'Content-Type': 'multipart/form-data'
        }
      });

      // Якщо бек повертає створену виставку
      setExhibitions(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error('Помилка при додаванні виставки:', err);
      throw err.response?.data?.message || err.message;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  return (
    <ExhibitionsContext.Provider value={{
      exhibitions,
      loading,
      error,
      totalPages,
      fetchExhibitions,
      fetchSingleExhibition,
      addExhibition
    }}>
      {children}
    </ExhibitionsContext.Provider>
  );
};
