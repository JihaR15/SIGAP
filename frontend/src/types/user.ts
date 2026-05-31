export interface User {
  id: number;
  nama: string;
  username: string;
  role: "Manager" | "Operator";
  status: "Aktif" | "Nonaktif";
}