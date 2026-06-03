import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchJobs = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/export-jobs`)
    setJobs(res.data)
  }

  const createJob = async () => {
    try {
      setLoading(true)
      await axios.post(`${API_BASE_URL}/api/export-jobs`)
      await fetchJobs()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()

    const timer = setInterval(fetchJobs, 3000)
    return () => clearInterval(timer)
  }, [])

  const jobList = useMemo(() => jobs ?? [], [jobs])

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <div>
            <p className="mb-2 text-sm font-semibold text-blue-600">
              Data to Excel Exporter
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              데이터 요청 목록
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              엑셀 생성 요청 버튼을 클릭하면 작업이 시작됩니다.
            </p>
          </div>

          <button
            onClick={createJob}
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? '요청 중...' : '+ 엑셀 생성 요청'}
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">Export Jobs</h2>
            <p className="mt-1 text-sm text-slate-500">
              엑셀 생성 작업의 상태와 진행률을 확인할 수 있습니다.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                <tr>
                  <th className="px-6 py-4">Job ID</th>
                  <th className="px-6 py-4">상태</th>
                  <th className="px-6 py-4">진행률</th>
                  <th className="px-6 py-4">요청일시</th>
                  <th className="px-6 py-4">시작시간</th>
                  <th className="px-6 py-4">완료시간</th>
                  <th className="px-6 py-4">파일경로</th>
                  <th className="px-6 py-4">다운로드</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {jobList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center text-slate-500">
                      아직 요청된 엑셀 생성 작업이 없습니다.
                    </td>
                  </tr>
                ) : (
                  jobList.map((job) => {
                    const progress = job.progress ?? 0

                    return (
                      <tr
                        key={job.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5 font-semibold text-slate-900">
                          #{job.id}
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge status={job.status} />
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${getProgressColor(
                                  job.status,
                                )}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="w-10 text-xs font-semibold text-slate-500">
                              {progress}%
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {formatDate(job.requested_at)}
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {formatDate(job.started_at)}
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {formatDate(job.completed_at)}
                        </td>

                        <td className="max-w-[220px] truncate px-6 py-5 text-slate-600">
                          {job.file_path || '-'}
                        </td>

                        <td className="px-6 py-5">
                          {job.status === 'done' ? (
                            <a
                              href={`${API_BASE_URL}/api/export-jobs/${job.id}/download`}
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 whitespace-nowrap"
                            >
                              다운로드
                            </a>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}

function StatusBadge({ status }) {
  const label = {
    pending: '대기',
    processing: '처리중',
    done: '완료',
    failed: '실패',
  }

  const className = {
    pending: 'bg-slate-100 text-slate-700 ring-1 ring-slate-300',
    processing: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    done: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    failed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  }

  return (
    <span
className={`inline-flex rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
  className[status] || className.pending
      }`}
    >
      {label[status] || status}
    </span>
  )
}

function getProgressColor(status) {
  if (status === 'done') return 'bg-emerald-500'
  if (status === 'failed') return 'bg-red-500'
  if (status === 'processing') return 'bg-blue-500'
  return 'bg-slate-400'
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('ko-KR')
}

export default App