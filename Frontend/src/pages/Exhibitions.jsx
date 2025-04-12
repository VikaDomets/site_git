// // export default Exhibitions;
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import styles from '../styles/exhibitions.module.css';
// import img1 from '../assets/img/exh1.jpg';
// import img2 from '../assets/img/exh2.jpg';
// import img3 from '../assets/img/exh3.jpg';


// const exhibitionsData = [
//   {
//     id: 1, // Додано унікальний ID
//     title: 'Виставка "Знак кольору"',
//     date: '22.03.23-22.04.23',
//     image: img1,
//     description: 'Опис виставки "Знак кольору"...' // Додано опис
//   },
//   {
//     id: 2,
//     title: 'Виставка «Геометрія кольору»',
//     date: '20.07.23-18.08.23',
//     image: img2,
//     description: 'Опис виставки "Геометрія кольору"...'
//   },
//   {
//     id: 3,
//     title: 'Виставка "Осмислення"',
//     date: '04.06.23-16.06.23',
//     image: img3,
//     description: 'Опис виставки "Осмислення"...'
//   },
//   {
//     id: 4,
//     title: 'Виставка "Знак кольору"',
//     date: '22.03.23-22.04.23',
//     image: img1,
//     description: 'Опис повторної виставки...'
//   },
//   {
//     id: 5,
//     title: 'Виставка "Знак кольору"',
//     date: '22.03.23-22.04.23',
//     image: img3,
//     description: 'Опис останньої виставки...'
//   },
// ];

// const itemsPerPage = 3;

// const Exhibitions = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = Math.ceil(exhibitionsData.length / itemsPerPage);

//   const currentExhibitions = exhibitionsData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <section className={styles.exhibition}>
//       <div className={styles['exhibition-section']}>
//         <div className={styles['text-container']}>
//           <h1>
//             Перелік <br />
//             <strong>Виставок</strong>
//           </h1>
//           <p>
//             Виставки створюють унікальні можливості для вивчення, враження та
//             взаємодії з різними сферами. <br />
//             Мистецтва, науки та культури.
//           </p>
//         </div>

//         {currentExhibitions.map((item, index) => (
//           <div className={styles['section-img']} key={index}>
//             <div className={styles['exh-container']}>
//               <div className={styles['exh-img']}>
//                 {item.link ? (
//                   <a href={item.link}>
//                     <img src={item.image} alt={item.title} className={styles['exh-img-item']} />
//                   </a>
//                 ) : (
//                   <Link to={`/exhibition/${item.id}`}>
//                     <img src={item.image} alt={item.title} className={styles['exh-img-item']} />
//                   </Link>
//                 )}
//               </div>
//               <div className={styles['exh-text']}>
//                 {item.link ? (
//                   <a href={item.link} className={styles['exh-link']}>
//                     <h1>{item.title}</h1>
//                   </a>
//                 ) : (
//                   <Link to={`/exhibition/${item.id}`} className={styles['exh-link']}>
//                     <h1>{item.title}</h1>
//                   </Link>
//                 )}
//                 <h2>{item.date}</h2>
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className={styles['pagination-container']}>
//           <nav>
//             <ul className={styles.pagination}>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <li
//                   key={i}
//                   className={`${styles['page-item']} ${currentPage === i + 1 ? styles.active : ''}`}
//                 >
//                   <button
//                     className={styles['page-link']}
//                     onClick={() => setCurrentPage(i + 1)}
//                   >
//                     {i + 1}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </section>
//   );
// };


import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExhibitionsContext } from '../context/ExhibitionsContext';
import styles from '../styles/exhibitions.module.css';

const Exhibitions = () => {
  const {
    exhibitions,
    loading,
    error,
    totalPages,
    fetchExhibitions
  } = useContext(ExhibitionsContext);

  const [currentPage, setCurrentPage] = useState(1);

  // Завантаження виставок при зміні сторінки
  useEffect(() => {
    fetchExhibitions(currentPage);
  }, [currentPage]);

  return (
    <section className={styles.exhibition}>
      <div className={styles['exhibition-section']}>
        <div className={styles['text-container']}>
          <h1>
            Перелік <br />
            <strong>Виставок</strong>
          </h1>
          <p>
            Виставки створюють унікальні можливості для вивчення, враження та
            взаємодії з різними сферами. <br />
            Мистецтва, науки та культури.
          </p>
        </div>

        {loading && <p>Завантаження...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {exhibitions.map((item, index) => (
          <div className={styles['section-img']} key={item.id || index}>
            <div className={styles['exh-container']}>
              <div className={styles['exh-img']}>
                <Link to={`/exhibition/${item.id}`}>
                  <img
                    src={item.image instanceof File ? URL.createObjectURL(item.image) : item.image}
                    alt={item.title}
                    className={styles['exh-img-item']}
                  />
                </Link>
              </div>
              <div className={styles['exh-text']}>
                <Link to={`/exhibition/${item.id}`} className={styles['exh-link']}> 
                  <h1>{item.title}</h1>
                </Link>
                <h2>{item.date || `${item.start_date} - ${item.end_date}`}</h2>
              </div>
            </div>
          </div>
        ))}

        <div className={styles['pagination-container']}>
          <nav>
            <ul className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`${styles['page-item']} ${currentPage === i + 1 ? styles.active : ''}`}
                >
                  <button
                    className={styles['page-link']}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Exhibitions;


/*
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExhibitionsContext } from '../context/ExhibitionsContext';
import styles from '../styles/exhibitions.module.css';

import img1 from '../assets/img/exh1.jpg';
import img2 from '../assets/img/exh2.jpg';
import img3 from '../assets/img/exh3.jpg';

// Статичні (локальні) виставки
const staticExhibitions = [
  {
    id: 'local-1',
    title: 'Виставка "Знак кольору"',
    date: '22.03.23-22.04.23',
    image: img1,
    description: 'Опис виставки "Знак кольору"...'
  },
  {
    id: 'local-2',
    title: 'Виставка «Геометрія кольору»',
    date: '20.07.23-18.08.23',
    image: img2,
    description: 'Опис виставки "Геометрія кольору"...'
  },
  {
    id: 'local-3',
    title: 'Виставка "Осмислення"',
    date: '04.06.23-16.06.23',
    image: img3,
    description: 'Опис виставки "Осмислення"...'
  },
  {
    id: 'local-4',
    title: 'Виставка "Знак кольору"',
    date: '22.03.23-22.04.23',
    image: img1,
    description: 'Опис повторної виставки...'
  },
  {
    id: 'local-5',
    title: 'Виставка "Знак кольору"',
    date: '22.03.23-22.04.23',
    image: img3,
    description: 'Опис останньої виставки...'
  },
];

const itemsPerPage = 3;

const Exhibitions = () => {
  const { exhibitions, loading, error } = useContext(ExhibitionsContext);
  const [currentPage, setCurrentPage] = useState(1);

  const allExhibitions = [...staticExhibitions, ...exhibitions];
  const totalPages = Math.ceil(allExhibitions.length / itemsPerPage);

  const currentExhibitions = allExhibitions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className={styles.exhibition}>
      <div className={styles['exhibition-section']}>
        <div className={styles['text-container']}>
          <h1>
            Перелік <br />
            <strong>Виставок</strong>
          </h1>
          <p>
            Виставки створюють унікальні можливості для вивчення, враження та
            взаємодії з різними сферами. <br />
            Мистецтва, науки та культури.
          </p>
        </div>

        {loading && <p>Завантаження...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {currentExhibitions.map((item, index) => (
          <div className={styles['section-img']} key={item.id || index}>
            <div className={styles['exh-container']}>
              <div className={styles['exh-img']}>
                <Link to={`/exhibition/${item.id}`}>
                  <img
                    src={item.image instanceof File ? URL.createObjectURL(item.image) : item.image}
                    alt={item.title}
                    className={styles['exh-img-item']}
                  />
                </Link>
              </div>
              <div className={styles['exh-text']}>
                <Link to={`/exhibition/${item.id}`} className={styles['exh-link']}> 
                  <h1>{item.title}</h1>
                </Link>
                <h2>{item.date || `${item.start_date} - ${item.end_date}`}</h2>
              </div>
            </div>
          </div>
        ))}

        <div className={styles['pagination-container']}>
          <nav>
            <ul className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`${styles['page-item']} ${currentPage === i + 1 ? styles.active : ''}`}
                >
                  <button
                    className={styles['page-link']}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};
//<Link to={`/exhibition/${item.id}`} className={styles['exh-link']}> 
export default Exhibitions;
*/