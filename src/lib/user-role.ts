export const getUserRole = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('userRole') || '';
};

export const isAdmin = (): boolean => {
  return getUserRole() === 'admin';
};

export const isTeacher = (): boolean => {
  return getUserRole() === 'teacher';
};

export const isStudent = (): boolean => {
  return getUserRole() === 'student';
};

export const isParent = (): boolean => {
  return getUserRole() === 'parent';
};