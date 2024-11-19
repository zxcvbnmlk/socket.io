export interface menuItems {
  name: string;
  title: string;
  icon: string;
  link: string;
}

export interface ApiGitHub {
  ApiGitHub: string;
}

export interface credentials {
  username: string,
  token: string
}

export interface users extends credentials{
  userID: string
}
export interface message extends credentials{
  date: string,
  text: string
}

