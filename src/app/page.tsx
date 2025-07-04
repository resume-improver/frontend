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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [vacancyFile, setVacancyFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeFile || !vacancyFile) {
      setError('Пожалуйста, загрузите оба файла.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('resume_file', resumeFile);
      formData.append('vacancy_file', vacancyFile);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.post(`${apiUrl}/upload_pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Загрузите PDF резюме:</label>
        <div className="flex items-center gap-4">
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition-colors font-semibold">
            Выберите файл
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {resumeFile ? resumeFile.name : 'Файл не выбран'}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Загрузите PDF вакансии:</label>
        <div className="flex items-center gap-4">
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition-colors font-semibold">
            Выберите файл
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setVacancyFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {vacancyFile ? vacancyFile.name : 'Файл не выбран'}
          </span>
        </div>
      </div>

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
