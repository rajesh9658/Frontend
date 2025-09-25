export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  protected?: boolean;
  role?: 'teacher' | 'student';
}