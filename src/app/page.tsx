"use client";

import { useState } from 'react';
import axios from 'axios';

interface ResumeImprovements {
  missing_skills?: string[];
  suggested_rewordings?: { original: string; suggested: string }[];
  block_order_suggestions?: { block: string; action: string }[];
}

interface AnalyzeResult {
  cover_letter_draft?: string;
  resume_improvements?: ResumeImprovements;
  [key: string]: any;
}

export default function Home() {
  const [resume, setResume] = useState('');
  const [vacancy, setVacancy] = useState('');
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://0.0.0.0:8000/analyze', {
        resume_text: resume,
        vacancy_text: vacancy
      });
      setResult(res.data);
    } catch (err: any) {
      setError('Ошибка при анализе. Попробуйте еще раз.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto font-sans bg-white text-black dark:bg-gray-900 dark:text-gray-100 min-h-screen transition-colors">
      <h1 className="text-2xl font-bold mb-4">Анализ резюме</h1>

      <textarea
        className="w-full h-40 p-2 border mb-4 bg-white dark:bg-gray-800 text-black dark:text-gray-100"
        placeholder="Вставьте текст резюме..."
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      />

      <textarea
        className="w-full h-40 p-2 border mb-4 bg-white dark:bg-gray-800 text-black dark:text-gray-100"
        placeholder="Вставьте описание вакансии..."
        value={vacancy}
        onChange={(e) => setVacancy(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Анализируем...' : 'Анализировать'}
      </button>

      {error && (
        <div className="mt-4 text-red-600">{error}</div>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Сопроводительное письмо:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 mb-6 whitespace-pre-wrap border dark:border-gray-700">{result.cover_letter_draft}</pre>

          <h2 className="text-xl font-semibold mb-2">Рекомендации по улучшению резюме:</h2>

          {result.resume_improvements && (
            <div>
              <h3 className="font-semibold mt-4">Отсутствующие навыки:</h3>
              <ul className="list-disc list-inside">
                {result.resume_improvements.missing_skills?.map((skill: string, i: number) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>

              <h3 className="font-semibold mt-4">Переформулировки:</h3>
              <ul className="list-disc list-inside">
                {result.resume_improvements.suggested_rewordings?.map((r: any, i: number) => (
                  <li key={i}><b>Было:</b> {r.original} <br /><b>Стало:</b> {r.suggested}</li>
                ))}
              </ul>

              <h3 className="font-semibold mt-4">Рекомендации по структуре:</h3>
              <ul className="list-disc list-inside">
                {result.resume_improvements.block_order_suggestions?.map((s: any, i: number) => (
                  <li key={i}>{s.block} — {s.action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
