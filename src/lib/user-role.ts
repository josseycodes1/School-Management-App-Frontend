export const getUserRole = (): string => {
  if (typeof window === 'undefined') return '';
  

  const role = localStorage.getItem('role') || 
               localStorage.getItem('userRole') || 
               '';
  
  console.log('🔍 getUserRole() - Current role:', role);
  return role;
};

export const isAdmin = (): boolean => {
  const role = getUserRole();
  console.log('🔍 isAdmin() - Checking if role is admin:', role);
  return role === 'admin';
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