import { notFound } from "next/navigation";

/** Hit via middleware rewrite — looks like a normal 404 to outsiders. */
export default function AdminDeniedPage() {
  notFound();
}
