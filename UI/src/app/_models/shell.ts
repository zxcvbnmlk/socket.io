export interface MenuItems {
  name: string;
  title: string;
  icon: string;
  link: string;
}

export interface ApiGitHub {
  ApiGitHub: string;
}

export interface Credentials {
  username: string;
  token: string;
}

export interface Users extends Credentials {
  userID: string;
}
export interface Message extends Credentials {
  date: string;
  text: string;
}
