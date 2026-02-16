import { redirect } from "next/navigation";

export default function ReturnsPage() {
  redirect("/seller/orders");
}
