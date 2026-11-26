interface User {
  id: string;
  name: string;
  email: string;
}
export default interface LoginResponse {
  message: string;
  user: User;
}
