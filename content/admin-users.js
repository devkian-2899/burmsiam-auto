export const roles = ["Admin", "Moderator", "Content Manager"];

export const sampleUsers = [
  {
    id: "1",
    name: "Htet Aung",
    username: "htet.aung",
    email: "htet@burmsiamauto.com",
    phone: "0911110001",
    role: "Admin",
  },
  {
    id: "2",
    name: "Su Mon",
    username: "su.mon",
    email: "sumon@burmsiamauto.com",
    phone: "0922220002",
    role: "Moderator",
  },
  {
    id: "3",
    name: "Kyaw Zin",
    username: "kyaw.zin",
    email: "kyawzin@burmsiamauto.com",
    phone: "0933330003",
    role: "Content Manager",
  },
  {
    id: "4",
    name: "May Thu",
    username: "may.thu",
    email: "maythu@burmsiamauto.com",
    phone: "0944440004",
    role: "Content Manager",
  },
  {
    id: "5",
    name: "Min Khant",
    username: "min.khant",
    email: "minkhant@burmsiamauto.com",
    phone: "0955550005",
    role: "Moderator",
  },
  {
    id: "6",
    name: "Ei Phyu",
    username: "ei.phyu",
    email: "eiphyu@burmsiamauto.com",
    phone: "0966660006",
    role: "Admin",
  },
];

export function userById(id) {
  return sampleUsers.find((user) => user.id === id) || null;
}
