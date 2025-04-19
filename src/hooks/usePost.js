import { useMemo } from "react";

export const useSortedPost = (posts, sort) => {
    return useMemo(() => {
        if (!sort) return posts;  // Если сортировка не задана, возвращаем исходные посты

        return [...posts].sort((a, b) => {
            const aValue = a[sort];
            const bValue = b[sort];

            // Универсальная сортировка для всех типов данных
            return compareValues(aValue, bValue);
        });
    }, [sort, posts]);
};

// Функция для сравнения значений различных типов
function compareValues(a, b) {
    if (a === null || b === null) return a === b ? 0 : (a === null ? 1 : -1);
    if (typeof a === 'number' && typeof b === 'number') {
        // Сортировка чисел по возрастанию
        return a - b;
    }
    if (typeof a === 'string' && typeof b === 'string') {
        // Сортировка строк по алфавиту (с учетом локализации)
        return a.localeCompare(b);
    }
    // Сравнение как строк, если типы разные
    return a.toString().localeCompare(b.toString());
}

export const usePost = (posts, sort, query) => {
    const sortedPosts = useSortedPost(posts, sort);

    const sortedAndSearchedPosts = useMemo(() => {
        const trimmedQuery = query.trim();
        const queryAsNumber = parseFloat(trimmedQuery);
        const isNumberQuery = !isNaN(queryAsNumber);

        return sortedPosts.filter(post => {
            if (isNumberQuery) {
                // Если запрос является числом, ищем только по 'room_number'
                return post.room_number === queryAsNumber;
            }
            // Если запрос не является числом, можно применить другую логику поиска, например по строкам
            return Object.keys(post).some(key => {
                const value = post[key];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(trimmedQuery.toLowerCase());
                }
                return false;
            });
        });
    }, [query, sortedPosts]);

    return sortedAndSearchedPosts;
};