'use client';
import { useState } from 'react';

export default function Analytics() {
  const [range, setRange] = useState('Last 6 Months');

  const enrollmentData = [
    { month: 'Jan', enrollments: 245 },
    { month: 'Feb', enrollments: 312 },
    { month: 'Mar', enrollments: 289 },
    { month: 'Apr', enrollments: 425 },
    { month: 'May', enrollments: 398 },
    { month: 'Jun', enrollments: 512 },
  ];

  const performanceData = [
    { course: 'UX Design', completion: 78, satisfaction: 92 },
    { course: 'React', completion: 65, satisfaction: 88 },
    { course: 'Business', completion: 82, satisfaction: 95 },
    { course: 'Python', completion: 71, satisfaction: 85 },
    { course: 'Marketing', completion: 88, satisfaction: 90 },
  ];

  const categories = [
    { name: 'Design', value: 35 },
    { name: 'Development', value: 40 },
    { name: 'Business', value: 15 },
    { name: 'Marketing', value: 10 },
  ];

  const learningTimeData = [
    { week: 'Week 1', time: 4.2 },
    { week: 'Week 2', time: 5.1 },
    { week: 'Week 3', time: 4.8 },
    { week: 'Week 4', time: 6.2 },
    { week: 'Week 5', time: 5.5 },
    { week: 'Week 6', time: 6.8 },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
          <p className="text-gray-500">Comprehensive insights into learning performance</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => alert('Date range filter clicked')}
            className="border px-4 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2"
          >
            📅 {range}
          </button>
          <button
            onClick={() => alert('Report downloaded!')}
            className="bg-linear-to-r from-cyan-500 to-blue-400 text-white px-4 py-2 rounded-md shadow-md hover:scale-105 transition"
          >
            ⬇️ Export Report
          </button>
        </div>
      </div>

      {/* Enrollment Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Enrollment Trends</h3>
          <p className="text-sm text-gray-500 mb-4">Monthly enrollment statistics</p>
          <div className="h-48 flex items-end gap-4">
            {enrollmentData.map((d, i) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div
                  className="bg-linear-to-r from-cyan-500 to-blue-400 rounded-t-md w-8"
                  style={{ height: `${(d.enrollments / 512) * 100}%` }}
                ></div>
                <span className="text-xs mt-1 text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Course Performance</h3>
          <p className="text-sm text-gray-500 mb-4">Completion vs satisfaction rates</p>
          <div className="space-y-3">
            {performanceData.map((course) => (
              <div key={course.course}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{course.course}</span>
                  <span>{course.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mb-1">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${course.completion}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Satisfaction: {course.satisfaction}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Category Distribution</h3>
          <p className="text-sm text-gray-500 mb-4">Course enrollment by category</p>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{cat.name}</span>
                  <span>{cat.value}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full ${cat.name === 'Development'
                        ? 'bg-purple-500'
                        : cat.name === 'Design'
                        ? 'bg-blue-500'
                        : cat.name === 'Business'
                        ? 'bg-green-500'
                        : 'bg-pink-500'
                      }`}
                    style={{ width: `${cat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Learning Time */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Average Learning Time</h3>
          <p className="text-sm text-gray-500 mb-4">Hours per week trend</p>
          <div className="flex items-end gap-4 h-48">
            {learningTimeData.map((d, i) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div
                  className="bg-linear-to-r from-cyan-500 to-blue-400 rounded-t-md w-8"
                  style={{ height: `${(d.time / 6.8) * 100}%` }}
                ></div>
                <span className="text-xs mt-1 text-gray-500">{d.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            icon="📈"
            title="↑ 23%"
            subtitle="Enrollment Growth"
            note="Compared to last quarter"
          />
          <InsightCard
            icon="🏅"
            title="89%"
            subtitle="Avg Satisfaction"
            note="Across all courses"
          />
          <InsightCard
            icon="⏰"
            title="5.4h"
            subtitle="Avg Learning Time"
            note="Per week per learner"
          />
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  subtitle,
  note,
}: {
  icon: string;
  title: string;
  subtitle: string;
  note: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-linear-to-r from-cyan-500 to-blue-400 border border-blue-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 flex items-center justify-center bg-linear-to-r from-cyan-500 to-blue-400 text-white rounded-lg text-xl">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400">{note}</p>
    </div>
  );
}
