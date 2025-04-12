
// import { useState, useEffect } from 'react';
// import styles from '../styles/commentSection.module.css';

// const CommentSection = ({ exhibitionId }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');

//   // Завантаження коментарів з localStorage
//   useEffect(() => {
//     const savedComments = JSON.parse(localStorage.getItem(`comments_${exhibitionId}`)) || [];
//     setComments(savedComments);
//   }, [exhibitionId]);

//   const addComment = () => {
//     if (!newComment.trim()) return;
//     const comment = {
//       id: Date.now(),
//       text: newComment,
//       date: new Date().toISOString(),
//       author: 'Анонім' // Пізніше додати авторизацію
//     };
//     const updatedComments = [...comments, comment];
//     setComments(updatedComments);
//     localStorage.setItem(`comments_${exhibitionId}`, JSON.stringify(updatedComments));
//     setNewComment('');
//   };

//   return (
//     <div className={styles.commentSection}>
//       <h3>Коментарі ({comments.length})</h3>
//       <ul className={styles.commentList}>
//         {comments.map(comment => (
//           <li key={comment.id} className={styles.comment}>
//             <p className={styles.commentText}>{comment.text}</p>
//             <div className={styles.commentMeta}>
//               <span className={styles.author}>{comment.author}</span>
//               <span className={styles.date}>
//                 {new Date(comment.date).toLocaleDateString()}
//               </span>
//             </div>
//           </li>
//         ))}
//       </ul>
//       <textarea
//         value={newComment}
//         onChange={(e) => setNewComment(e.target.value)}
//         placeholder="Напишіть коментар..."
//         className={styles.commentInput}
//       />
//       <button onClick={addComment} className={styles.commentSubmit}>
//         Надіслати
//       </button>
//     </div>
//   );
// };



import { useState, useEffect } from 'react';
import styles from '../styles/commentSection.module.css';
import axios from 'axios';

// API налаштування
const API = {
  baseUrl: 'http://127.0.0.1:8000/api', // Ваша база URL
  endpoints: {
    getComments: (exhibitionId) => `/exhibitions/${exhibitionId}/comments`,
    addComment: (exhibitionId) => `/exhibitions/${exhibitionId}/comments`,
  }
};

const CommentSection = ({ exhibitionId }) => {
  const [comments, setComments] = useState([]); // Ініціалізація як порожній масив
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Отримання коментарів
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API.baseUrl}${API.endpoints.getComments(exhibitionId)}`);
        
        console.log('Отримані коментарі:', response.data); // Логування отриманих даних
        
        // Перевірка, чи це масив
        const data = Array.isArray(response.data) ? response.data : [];
        setComments(data); // Встановлення даних як масив
      } catch (err) {
        setError('Не вдалося завантажити коментарі');
        console.error('Помилка:', err);
      } finally {
        setLoading(false);
      }
    };

    if (exhibitionId) {
      fetchComments();
    }
  }, [exhibitionId]);

  // Додавання коментаря
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem('access');
    const commentData = {
      text: newComment,
      exhibition: exhibitionId
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${API.baseUrl}${API.endpoints.addComment(exhibitionId)}`,
        commentData,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {} // Анонімний користувач
        }
      );
      
      // Додавання нового коментаря до списку
      setComments(prev => [...prev, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Не вдалося додати коментар');
      console.error('Помилка:', err);
    } finally {
      setLoading(false);
    }
  };

  // Перевірка, чи comments - це масив
  if (!Array.isArray(comments)) {
    console.error('comments не є масивом:', comments);
  }

  return (
    <div className={styles.commentSection}>
      <h3>Коментарі ({comments.length})</h3>

      {error && <div className={styles.error}>{error}</div>}

      <ul className={styles.commentList}>
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className={styles.comment}>
              <p className={styles.commentText}>{comment.text}</p>
              <div className={styles.commentMeta}>
                <span className={styles.author}>
                  {comment.author_name }
                </span>
                <span className={styles.date}>
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p>Немає коментарів</p>
        )}
      </ul>

      <div className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Залиште ваш коментар..."
          className={styles.commentInput}
          disabled={loading}
        />
        <button
          onClick={handleAddComment}
          className={styles.commentSubmit}
          disabled={loading || !newComment.trim()}
        >
          {loading ? 'Надсилання...' : 'Відправити'}
        </button>
      </div>
    </div>
  );
};

export default CommentSection;


/*
import { useState, useEffect } from 'react';
import styles from '../styles/commentSection.module.css';
import axios from 'axios';

// Тимчасовий мок API для тестування, поки не підключений бекенд
const API = {
  baseUrl: 'https://your-api-domain.com/api' || 'http://localhost:3001/api',
  endpoints: {
    getComments: (exhibitionId) => `/exhibitions/${exhibitionId}/comments`,
    addComment: (exhibitionId) => `/exhibitions/${exhibitionId}/comments`,
  }
};

// Функція для мокування API, якщо бекенд не доступний
const mockApi = {
  getComments: async (exhibitionId) => {
    // Спробуємо отримати з localStorage
    const saved = localStorage.getItem(`comments_${exhibitionId}`);
    return saved ? JSON.parse(saved) : [];
  },
  addComment: async (exhibitionId, comment) => {
    const comments = await mockApi.getComments(exhibitionId);
    const newComment = {
      ...comment,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    const updated = [...comments, newComment];
    localStorage.setItem(`comments_${exhibitionId}`, JSON.stringify(updated));
    return newComment;
  }
};

const CommentSection = ({ exhibitionId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(true);

  // Перевірка доступності бекенду
  useEffect(() => {
    const checkApi = async () => {
      try {
        await axios.get(`${API.baseUrl}/health`);
        setApiAvailable(true);
      } catch {
        setApiAvailable(false);
        console.warn('Бекенд не доступен, використовується локальне сховище');
      }
    };
    checkApi();
  }, []);

  // Отримання коментарів
  useEffect(() => {
    if (!exhibitionId) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        let data;
        
        if (apiAvailable) {
          const response = await axios.get(
            `${API.baseUrl}${API.endpoints.getComments(exhibitionId)}`
          );
          data = response.data;
        } else {
          data = await mockApi.getComments(exhibitionId);
        }
        
        setComments(data);
      } catch (err) {
        setError('Не вдалося завантажити коментарі');
        console.error('Помилка:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [exhibitionId, apiAvailable]);

  // Додавання коментаря
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      text: newComment,
      authorName: 'Анонім'
    };

    try {
      setLoading(true);
      let result;
      
      if (apiAvailable) {
        const response = await axios.post(
          `${API.baseUrl}${API.endpoints.addComment(exhibitionId)}`,
          commentData
        );
        result = response.data;
      } else {
        result = await mockApi.addComment(exhibitionId, commentData);
      }
      
      setComments(prev => [...prev, result]);
      setNewComment('');
    } catch (err) {
      setError('Не вдалося додати коментар');
      console.error('Помилка:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.commentSection}>
      <h3>Коментарі ({comments.length})</h3>
      
      {!apiAvailable && (
        <div className={styles.warning}>Режим офлайн: коментарі зберігаються локально</div>
      )}
      
      {error && <div className={styles.error}>{error}</div>}
      
      <ul className={styles.commentList}>
        {comments.map(comment => (
          <li key={comment.id || comment._id} className={styles.comment}>
            <p className={styles.commentText}>{comment.text}</p>
            <div className={styles.commentMeta}>
              <span className={styles.author}>
                {comment.author?.name || comment.authorName || 'Анонім'}
              </span>
              <span className={styles.date}>
                {new Date(comment.createdAt || comment.date).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
      
      <div className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Залиште ваш коментар..."
          className={styles.commentInput}
          disabled={loading}
        />
        <button
          onClick={handleAddComment}
          className={styles.commentSubmit}
          disabled={loading || !newComment.trim()}
        >
          {loading ? 'Надсилання...' : 'Відправити'}
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
*/