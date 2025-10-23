// app/list/results/page.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';
import usePagination from '@/hooks/usePagination';

interface Exam {
  id: number;
  title: string;
  subject: {
    id: number;
    name: string;
  };
  teacher?: any;
}

interface Assignment {
  id: number;
  title: string;
  subject: {
    id: number;
    name: string;
  };
  teacher?: any;
}

interface Result {
  id: number;
  student: {
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  exam?: Exam;
  assignment?: Assignment;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  comments?: string;
  created_at: string;
}

const StudentResultsPage = () => {
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const router = useRouter();

  const {
    data: results,
    loading,
    error,
    pagination,
    handlePageChange,
    refreshData
  } = usePagination<Result>('/api/assessment/results/', {
    initialPage: 1,
    pageSize: 10
  });

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/login');
          return;
        }

        const studentRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/me/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setStudentInfo(studentRes.data);
      } catch (err) {
        console.error('Error fetching student info:', err);
      }
    };

    fetchStudentInfo();
  }, [router]);

  //function to determine grade color
  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A':
      case 'A+':
        return 'text-green-600 bg-green-100';
      case 'B':
      case 'B+':
        return 'text-blue-600 bg-blue-100';
      case 'C':
      case 'C+':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
      case 'D+':
        return 'text-orange-600 bg-orange-100';
      case 'F':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // calculate percentage
  const calculatePercentage = (obtained: number, total: number) => {
    return ((obtained / total) * 100).toFixed(1);
  };

  //get assessment type and title
  const getAssessmentInfo = (result: Result) => {
    if (result.exam) {
      return {
        type: 'Exam',
        title: result.exam.title,
        subject: result.exam.subject.name
      };
    } else if (result.assignment) {
      return {
        type: 'Assignment',
        title: result.assignment.title,
        subject: result.assignment.subject.name
      };
    }
    return {
      type: 'Assessment',
      title: 'Unknown',
      subject: 'Unknown'
    };
  };

  //calculate overall performance
  const calculateOverallPerformance = () => {
    if (results.length === 0) return { average: 0, totalAssessments: 0, highestSubject: null };

    const totalPercentage = results.reduce((sum, result) => {
      return sum + (result.marks_obtained / result.total_marks) * 100;
    }, 0);

    const average = totalPercentage / results.length;
    const highestSubject = results.reduce((prev, current) => 
      (prev.marks_obtained / prev.total_marks) > (current.marks_obtained / current.total_marks) ? prev : current
    );

    return {
      average: average.toFixed(1),
      totalAssessments: results.length,
      highestSubject
    };
  };

  const overallPerformance = calculateOverallPerformance();

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-josseypink1"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center bg-josseypink1 text-white px-6 py-2 rounded-lg hover:bg-josseypink2 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-josseypink1">My Results</h1>
              <p className="text-gray-600 mt-2">
                {studentInfo && `${studentInfo.user.first_name} ${studentInfo.user.last_name}`} • {studentInfo && studentInfo.grade} • {studentInfo && studentInfo.class_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center text-josseypink1 hover:text-josseypink2 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Overall Average</h3>
                <p className="text-2xl font-bold text-gray-900">{overallPerformance.average}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Assessments Completed</h3>
                <p className="text-2xl font-bold text-gray-900">{overallPerformance.totalAssessments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Best Performance</h3>
                <p className="text-lg font-bold text-gray-900">
                  {overallPerformance.highestSubject 
                    ? `${getAssessmentInfo(overallPerformance.highestSubject).subject} (${calculatePercentage(overallPerformance.highestSubject.marks_obtained, overallPerformance.highestSubject.total_marks)}%)`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {results.length} of {pagination.count} results
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Assessment Results</h2>
            <p className="mt-1 text-sm text-gray-600">Your performance across all assessments</p>
          </div>
          
          {results.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No results available</h3>
              <p className="text-gray-600">Your results will appear here once they are published.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {results.map((result) => {
                const assessmentInfo = getAssessmentInfo(result);
                return (
                  <div key={result.id} className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{assessmentInfo.title}</h3>
                        <p className="text-sm text-gray-600">
                          {assessmentInfo.type} • {assessmentInfo.subject} • {new Date(result.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Marks Obtained</span>
                        <span className="text-sm font-medium text-gray-900">{result.marks_obtained} / {result.total_marks}</span>
                      </div>
                      
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-josseypink1 h-2.5 rounded-full" 
                          style={{ width: `${calculatePercentage(result.marks_obtained, result.total_marks)}%` }}
                        ></div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-600">Percentage: {calculatePercentage(result.marks_obtained, result.total_marks)}%</span>
                        <span className="text-xs text-gray-600">Passing: 40%</span>
                      </div>
                    </div>
                    
                    {result.comments && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Teacher's Comments</h4>
                        <p className="text-sm text-gray-600 mt-1">{result.comments}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination for Results */}
          {pagination.total_pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination 
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Performance Summary - Only show if we have results */}
        {results.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Subject Performance Distribution</h3>
                <div className="space-y-4">
                  {results.map((result) => {
                    const assessmentInfo = getAssessmentInfo(result);
                    return (
                      <div key={result.id} className="flex items-center">
                        <span className="w-32 text-sm text-gray-600 truncate">{assessmentInfo.subject}</span>
                        <div className="flex-1 ml-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-josseypink1" 
                              style={{ width: `${calculatePercentage(result.marks_obtained, result.total_marks)}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="w-16 text-right text-sm font-medium text-gray-900 ml-2">
                          {calculatePercentage(result.marks_obtained, result.total_marks)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Grade Distribution</h3>
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D', 'F'].map((grade) => {
                    const count = results.filter(r => r.grade.toUpperCase().startsWith(grade)).length;
                    const percentage = (count / results.length) * 100;
                    
                    return (
                      <div key={grade} className="flex items-center">
                        <span className="w-8 text-sm font-medium text-gray-900">{grade}</span>
                        <div className="flex-1 mx-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-josseypink1" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="w-12 text-right text-sm text-gray-600">{count} assessment(s)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResultsPage;