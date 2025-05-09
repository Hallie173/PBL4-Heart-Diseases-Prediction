export interface userState {
  isAuthenticated: boolean;
  token: string;
  account: {
    groupWithRoles: {
      _id: string;
      name: string;
      description: string;
    };
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    avatar: string;
    address: string;
  };
}
